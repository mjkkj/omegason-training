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

// All users (employees + managers) — for the role-management screen.
export async function fetchAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*').order('role').order('name')
  if (error) throw error
  return data || []
}

// Promote / demote a user. role must be 'manager' or 'employee'.
// Returns the updated row. Throws if RLS blocked it (0 rows changed).
export async function updateUserRole(userId, role) {
  const { data, error } = await supabase
    .from('profiles').update({ role }).eq('id', userId).select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('RLS_BLOCKED')
  }
  return data[0]
}

// Xoá tài khoản: xoá hồ sơ (profiles) và dọn dữ liệu liên quan.
// Lưu ý: KHÔNG xoá được bản ghi đăng nhập trong auth.users bằng anon key —
// việc đó cần service_role (làm ở Supabase Dashboard → Authentication → Users).
// Cần policy DELETE cho quản lý (xem supabase-roles.sql), nếu không sẽ RLS_BLOCKED.
export async function deleteUserAccount(userId) {
  // Dọn bài nộp liên quan trước (nếu chưa có ON DELETE CASCADE / policy thì bỏ qua).
  await supabase.from('submissions').delete().eq('employee_id', userId)

  const { data, error } = await supabase
    .from('profiles').delete().eq('id', userId).select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('RLS_BLOCKED')
  }
  return data[0]
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

export async function fetchDocuments() {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function uploadDocument({ title, description, fileName, fileData, fileSize, mimeType, uploadedBy }) {
  const { error } = await supabase.from('documents').insert({
    title, description: description || '',
    file_name: fileName, file_data: fileData, file_size: fileSize, mime_type: mimeType,
    uploaded_by: uploadedBy,
  })
  if (error) throw error
}

export async function updateDocument(id, { title, description }) {
  const { error } = await supabase.from('documents').update({ title, description: description || '' }).eq('id', id)
  if (error) throw error
}

export async function deleteDocument(id) {
  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) throw error
}

// Lưu kết quả chấm dạng checklist: feedback chứa JSON review (xem checklist.js).
// Không còn điểm số — grade luôn null; bài chuyển sang 'graded' (đã chấm).
export async function saveReview({ submissionId, feedback }) {
  const { error } = await supabase.from('submissions').update({
    status: 'graded',
    grade: null,
    feedback,
    graded_at: new Date().toISOString(),
  }).eq('id', submissionId)
  if (error) throw error
}
