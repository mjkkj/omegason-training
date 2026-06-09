import { create } from 'zustand'
import { supabase } from './supabase'

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
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (profile) set({ currentUser: { ...profile, email: session.user.email } })
    }
    set({ initialized: true })

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profile) set({ currentUser: { ...profile, email: session.user.email } })
      }
      if (event === 'SIGNED_OUT') set({ currentUser: null })
    })
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
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

export async function gradeSubmission({ submissionId, grade, feedback, approved }) {
  const { error } = await supabase.from('submissions').update({
    status: approved ? 'graded' : 'revision',
    grade: approved ? grade : null,
    feedback,
    graded_at: new Date().toISOString(),
  }).eq('id', submissionId)
  if (error) throw error
}
