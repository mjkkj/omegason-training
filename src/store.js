import { create } from 'zustand'
import { supabase } from './supabase'

// Fetch profile; if missing (account pre-dates trigger), create it automatically.
async function ensureProfile(user) {
  const { data: existing, error: fetchErr } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (existing) return existing
  if (fetchErr && fetchErr.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is expected; anything else is a real error
    console.error('[ensureProfile] fetch error:', fetchErr)
    return null
  }

  const name     = user.user_metadata?.name || user.email.split('@')[0]
  const initials = deriveInitials(name)
  const { error: insertErr } = await supabase
    .from('profiles').insert({ id: user.id, name, initials, role: 'employee' })
  if (insertErr) {
    console.error('[ensureProfile] insert error:', insertErr)
    return null
  }

  const { data: created } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  return created || null
}

function deriveInitials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export const useStore = create((set, get) => ({
  currentUser: null,
  initialized: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const profile = await ensureProfile(session.user)
      if (profile) set({ currentUser: { ...profile, email: session.user.email } })
    }
    set({ initialized: true })

    supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        const profile = await ensureProfile(session.user)
        if (profile) set({ currentUser: { ...profile, email: session.user.email } })
      }
      if (event === 'SIGNED_OUT') set({ currentUser: null })
    })
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Eagerly load profile right after sign-in (don't wait for onAuthStateChange)
    if (data.user) {
      const profile = await ensureProfile(data.user)
      if (!profile) throw new Error('Đăng nhập OK nhưng không tải được hồ sơ. Vui lòng kiểm tra bảng "profiles" trong Supabase có tồn tại chưa.')
      set({ currentUser: { ...profile, email: data.user.email } })
    }
  },

  signup: async (email, password, name) => {
    const initials = deriveInitials(name)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, initials } },
    })
    if (error) throw error
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ currentUser: null })
  },
}))

// ── Data helpers (called directly from pages) ──────────────────────────────

export async function fetchMySubmissions(employeeId) {
  const { data, error } = await supabase.from('submissions').select('*').eq('employee_id', employeeId).order('submitted_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function fetchAllSubmissions() {
  const { data, error } = await supabase.from('submissions').select('*, profiles(id,name,initials,role)').order('submitted_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function fetchAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'employee').order('name')
  if (error) throw error
  return data || []
}

export async function upsertSubmission({ employeeId, taskId, fileName, fileContent, fileSize, note }) {
  const { error } = await supabase.from('submissions').upsert({
    employee_id: employeeId,
    task_id: taskId,
    status: 'pending',
    file_name: fileName,
    file_content: fileContent,
    file_size: fileSize,
    note: note || '',
    submitted_at: new Date().toISOString(),
    grade: null,
    feedback: null,
    graded_at: null,
  }, { onConflict: 'employee_id,task_id' })
  if (error) throw error
}

export async function fetchTaskResources() {
  const { data, error } = await supabase.from('task_resources').select('task_id, videos')
  if (error) throw error
  const result = {}
  ;(data || []).forEach(row => { result[row.task_id] = row.videos || [] })
  return result
}

export async function fetchTaskVideos(taskId) {
  const { data } = await supabase.from('task_resources').select('videos').eq('task_id', taskId).single()
  return data?.videos || []
}

export async function saveTaskVideos(taskId, videos) {
  const { error } = await supabase.from('task_resources')
    .upsert({ task_id: taskId, videos, updated_at: new Date().toISOString() }, { onConflict: 'task_id' })
  if (error) throw error
}

export async function gradeSubmission({ submissionId, grade, feedback, approved }) {
  const { error } = await supabase.from('submissions').update({
    status: approved ? 'graded' : 'revision',
    grade: approved ? grade : null,
    feedback,
    graded_at: new Date().toISOString(),
  }).eq('id', submissionId)
  if (error) throw error
}
