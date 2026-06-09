import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateInitialSubmissions, TASKS } from './data'

function calcProgress(employeeId, submissions) {
  const total = TASKS.length; // 11 including final
  const done = submissions.filter(s => s.employeeId === employeeId && s.status === 'graded').length;
  return Math.round((done / total) * 100);
}

function calcAvgGrade(employeeId, submissions) {
  const graded = submissions.filter(s => s.employeeId === employeeId && s.status === 'graded' && s.grade != null);
  if (!graded.length) return null;
  return Math.round((graded.reduce((sum, s) => sum + s.grade, 0) / graded.length) * 10) / 10;
}

export const useStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      submissions: generateInitialSubmissions(),

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),

      submitReport: ({ employeeId, taskId, fileName, fileContent, fileSize, note }) => {
        const { submissions } = get();
        const existing = submissions.find(s => s.employeeId === employeeId && s.taskId === taskId);
        if (existing) {
          set({
            submissions: submissions.map(s =>
              s.id === existing.id
                ? { ...s, status: 'pending', fileName, fileContent, fileSize, note,
                    submittedAt: new Date().toISOString(), grade: null, feedback: null, gradedAt: null }
                : s
            ),
          });
        } else {
          set({
            submissions: [...submissions, {
              id: `sub-${employeeId}-${taskId}-${Date.now()}`,
              employeeId, taskId, status: 'pending',
              fileName, fileContent, fileSize, note,
              submittedAt: new Date().toISOString(),
              grade: null, feedback: null, gradedAt: null,
            }],
          });
        }
      },

      gradeSubmission: ({ submissionId, grade, feedback, approved }) => {
        set({
          submissions: get().submissions.map(s =>
            s.id === submissionId
              ? { ...s, status: approved ? 'graded' : 'revision', grade: approved ? grade : null,
                  feedback, gradedAt: new Date().toISOString() }
              : s
          ),
        });
      },

      // Derived helpers (called by components)
      getEmployeeProgress: (employeeId) => {
        const { submissions } = get();
        return {
          pct: calcProgress(employeeId, submissions),
          avgGrade: calcAvgGrade(employeeId, submissions),
          submitted: submissions.filter(s => s.employeeId === employeeId).length,
          graded: submissions.filter(s => s.employeeId === employeeId && s.status === 'graded').length,
          pending: submissions.filter(s => s.employeeId === employeeId && s.status === 'pending').length,
        };
      },

      getSubmission: (employeeId, taskId) => {
        return get().submissions.find(s => s.employeeId === employeeId && s.taskId === taskId) || null;
      },

      getPendingQueue: () => {
        return get().submissions.filter(s => s.status === 'pending');
      },
    }),
    {
      name: 'omegason-training-v2',
      partialize: (state) => ({
        currentUser: state.currentUser,
        submissions: state.submissions.map(s => ({
          ...s,
          // Truncate stored content to avoid localStorage overflow (keep first 50KB)
          fileContent: s.fileContent ? s.fileContent.slice(0, 51200) : null,
        })),
      }),
    }
  )
);
