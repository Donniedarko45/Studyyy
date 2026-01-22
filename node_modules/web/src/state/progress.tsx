import * as React from 'react'

type ProgressState = {
  xp: number
  streak: number
  lastSolvedDate: string | null
  completedToday: string[]
  xpByDay: Record<string, number>
  solvedProblems: string[] // NEW: Track solved problem IDs
  attemptedProblems: string[] // NEW: Track attempted problem IDs
}

type ProgressContextValue = ProgressState & {
  level: number
  xpIntoLevel: number
  solvedCount: number
  attemptedCount: number
  addXp: (amount: number, opts?: { solvedTopicId?: string; markCompleted?: boolean; problemId?: string }) => void
  markAttempted: (problemId: string) => void
  markSolved: (problemId: string) => void
  isProblemSolved: (problemId: string) => boolean
  isProblemAttempted: (problemId: string) => boolean
  resetToday: () => void
}

const STORAGE_KEY = 'studyy.progress.v2'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function loadInitial(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error('nope')
    const parsed = JSON.parse(raw) as ProgressState
    if (typeof parsed?.xp !== 'number') throw new Error('bad')
    return {
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
      lastSolvedDate: parsed.lastSolvedDate ?? null,
      completedToday: Array.isArray(parsed.completedToday) ? parsed.completedToday : [],
      xpByDay: parsed.xpByDay ?? {},
      solvedProblems: Array.isArray(parsed.solvedProblems) ? parsed.solvedProblems : [],
      attemptedProblems: Array.isArray(parsed.attemptedProblems) ? parsed.attemptedProblems : [],
    }
  } catch {
    return {
      xp: 0,
      streak: 0,
      lastSolvedDate: null,
      completedToday: [],
      xpByDay: {},
      solvedProblems: [],
      attemptedProblems: [],
    }
  }
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(() => loadInitial())

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addXp = React.useCallback(
    (amount: number, opts?: { solvedTopicId?: string; markCompleted?: boolean; problemId?: string }) => {
      setState((prev) => {
        const day = todayKey()

        let streak = prev.streak
        let lastSolvedDate = prev.lastSolvedDate
        if (opts?.markCompleted) {
          if (lastSolvedDate === day) {
            // no-op
          } else if (lastSolvedDate === yesterdayKey()) {
            streak = Math.max(1, streak + 1)
          } else {
            streak = 1
          }
          lastSolvedDate = day
        }

        const completedToday =
          opts?.markCompleted && opts?.solvedTopicId
            ? Array.from(new Set([...prev.completedToday, opts.solvedTopicId]))
            : prev.completedToday

        const xpByDay = {
          ...prev.xpByDay,
          [day]: (prev.xpByDay?.[day] ?? 0) + amount,
        }

        // Mark problem as solved if provided
        const solvedProblems = opts?.problemId && !prev.solvedProblems.includes(opts.problemId)
          ? [...prev.solvedProblems, opts.problemId]
          : prev.solvedProblems

        return {
          ...prev,
          xp: prev.xp + amount,
          streak,
          lastSolvedDate,
          completedToday,
          xpByDay,
          solvedProblems,
        }
      })
    },
    [],
  )

  const markAttempted = React.useCallback((problemId: string) => {
    setState((prev) => {
      if (prev.attemptedProblems.includes(problemId)) return prev
      return {
        ...prev,
        attemptedProblems: [...prev.attemptedProblems, problemId],
      }
    })
  }, [])

  const markSolved = React.useCallback((problemId: string) => {
    setState((prev) => {
      if (prev.solvedProblems.includes(problemId)) return prev
      return {
        ...prev,
        solvedProblems: [...prev.solvedProblems, problemId],
      }
    })
  }, [])

  const isProblemSolved = React.useCallback(
    (problemId: string) => state.solvedProblems.includes(problemId),
    [state.solvedProblems]
  )

  const isProblemAttempted = React.useCallback(
    (problemId: string) => state.attemptedProblems.includes(problemId),
    [state.attemptedProblems]
  )

  const resetToday = React.useCallback(() => {
    setState((prev) => ({ ...prev, completedToday: [] }))
  }, [])

  const level = Math.floor(state.xp / 100) + 1
  const xpIntoLevel = state.xp % 100
  const solvedCount = state.solvedProblems.length
  const attemptedCount = state.attemptedProblems.length

  const value: ProgressContextValue = React.useMemo(
    () => ({
      ...state,
      level,
      xpIntoLevel,
      solvedCount,
      attemptedCount,
      addXp,
      markAttempted,
      markSolved,
      isProblemSolved,
      isProblemAttempted,
      resetToday,
    }),
    [state, level, xpIntoLevel, solvedCount, attemptedCount, addXp, markAttempted, markSolved, isProblemSolved, isProblemAttempted, resetToday],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = React.useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
