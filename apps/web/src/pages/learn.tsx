import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react'

import { TOPICS, normalizeAnswer, subjectOrder, getTotalProblems, type Subject, type Topic, type Difficulty, type EducationLevel, type QuestionType } from '@/data/content'
import { generateQuestions, type GeneratedQuestion } from '@/lib/ai-questions'
import { useProgress } from '@/state/progress'
import { GoogleGenAI } from "@google/genai"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DifficultyBadge } from '@/components/ui/difficulty-badge'
import { cn } from '@/lib/utils'

type TopicGroup = {
  subject: Subject
  topics: Topic[]
}

function groupTopics(): TopicGroup[] {
  const by: Record<Subject, Topic[]> = { Maths: [], Science: [], Coding: [] }
  for (const t of TOPICS) by[t.subject].push(t)
  return (Object.keys(by) as Subject[])
    .sort((a: Subject, b: Subject) => subjectOrder(a) - subjectOrder(b))
    .map((s) => ({ subject: s, topics: by[s] }))
}

export function LearnPage() {
  const {
    xp, level, xpIntoLevel, streak, completedToday,
    solvedCount, addXp, markAttempted, isProblemSolved
  } = useProgress()
  const groups = React.useMemo(() => groupTopics(), [])
  const totalProblems = getTotalProblems()

  // Load user preferences from localStorage
  const [userPreferences, setUserPreferences] = React.useState<{
    subject: Subject | null
    educationLevel: EducationLevel | null
    questionType: QuestionType | null
    difficulty: Difficulty | null
  }>({
    subject: null,
    educationLevel: null,
    questionType: null,
    difficulty: null,
  })

  React.useEffect(() => {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      setUserPreferences(JSON.parse(saved))
    }
  }, [])

  // AI Question generation state
  const [aiQuestions, setAiQuestions] = React.useState<GeneratedQuestion[]>([])
  const [generatingQuestions, setGeneratingQuestions] = React.useState(false)
  const [showAiQuestions, setShowAiQuestions] = React.useState(false)
  const [showQuestionCountDialog, setShowQuestionCountDialog] = React.useState(false)
  const [selectedQuestionCount, setSelectedQuestionCount] = React.useState(5)

  const [openSubjects, setOpenSubjects] = React.useState<Record<Subject, boolean>>({
    Maths: true,
    Science: true,
    Coding: true,
  })

  // Set initial active topic based on user preferences
  const [activeTopicId, setActiveTopicId] = React.useState(() => {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      const prefs = JSON.parse(saved)
      if (prefs.subject) {
        const topic = TOPICS.find(t => t.subject === prefs.subject)
        return topic?.id ?? TOPICS[0]?.id ?? ''
      }
    }
    return TOPICS[0]?.id ?? ''
  })

  const activeTopic = React.useMemo(
    () => TOPICS.find((t) => t.id === activeTopicId) ?? TOPICS[0],
    [activeTopicId],
  )

  // Difficulty filter (for static questions)
  const [difficultyFilter, setDifficultyFilter] = React.useState<'All' | Difficulty>('All')

  // Filter problems based on user preferences
  const filteredProblems = React.useMemo(() => {
    let problems: any[] = []

    if (showAiQuestions && aiQuestions.length > 0) {
      problems = aiQuestions
    } else {
      problems = activeTopic.problems

      // Filter by education level if specified
      if (userPreferences.educationLevel) {
        problems = problems.filter(p =>
          p.educationLevel?.includes(userPreferences.educationLevel) ?? true
        )
      }

      // Filter by question type if specified
      if (userPreferences.questionType && userPreferences.questionType !== 'Mixed') {
        problems = problems.filter(p => p.questionType === userPreferences.questionType)
      }

      // Filter by difficulty if specified
      if (userPreferences.difficulty) {
        problems = problems.filter(p => p.difficulty === userPreferences.difficulty)
      }
    }

    return problems
  }, [activeTopic.problems, userPreferences, showAiQuestions, aiQuestions])

  const [problemIndex, setProblemIndex] = React.useState(0)
  const problem = filteredProblems[problemIndex] ?? filteredProblems[0]

  const [answer, setAnswer] = React.useState('')
  const [checked, setChecked] = React.useState<null | { ok: boolean; msg: string }>(null)
  const [showSteps, setShowSteps] = React.useState(false)
  const [stepsXpAwarded, setStepsXpAwarded] = React.useState<Record<string, boolean>>({})
  const [correctAwarded, setCorrectAwarded] = React.useState<Record<string, boolean>>({})

  // AI Chat state
  const [showAiPanel, setShowAiPanel] = React.useState(false)
  const [aiResponse, setAiResponse] = React.useState('')
  const [aiLoading, setAiLoading] = React.useState(false)

  React.useEffect(() => {
    setProblemIndex(0)
    setAnswer('')
    setChecked(null)
    setShowSteps(false)
  }, [activeTopicId, difficultyFilter])

  // Mark as attempted when user types
  React.useEffect(() => {
    if (answer.trim() && problem) {
      markAttempted(problem.id)
    }
  }, [answer, problem, markAttempted])

  const onCheck = () => {
    if (!problem) return
    const ok = normalizeAnswer(answer) === normalizeAnswer(problem.answer)
    setChecked(ok ? { ok: true, msg: 'Correct! +10 XP' } : { ok: false, msg: 'Not quite — try again.' })

    if (ok && !correctAwarded[problem.id]) {
      setCorrectAwarded((p) => ({ ...p, [problem.id]: true }))
      addXp(10, { solvedTopicId: activeTopic.id, markCompleted: true, problemId: problem.id })
    }
  }

  const onExplain = () => {
    if (!problem) return
    setShowSteps((v) => !v)
    if (!stepsXpAwarded[problem.id]) {
      setStepsXpAwarded((p) => ({ ...p, [problem.id]: true }))
      addXp(5)
    }
  }

  const onAskAI = async () => {
    if (!problem) return
    setShowAiPanel(true)
    setAiLoading(true)
    setAiResponse('')

    try {
      // Check if API key is configured
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        setAiResponse('⚠️ Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file to enable AI hints.')
        setAiLoading(false)
        return
      }

      const prompt = `You are an educational AI tutor helping a student with the following problem:

Problem: ${problem.title}
Statement: ${problem.statement}
Difficulty: ${problem.difficulty}

The student is stuck and needs a hint. Provide a helpful hint WITHOUT giving away the direct answer. Guide them towards understanding the concept. Keep your response concise (2-3 sentences max).`

      const ai = new GoogleGenAI({ apiKey })

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      })

      const text = response.text || 'Unable to generate hint. Please try again.'
      setAiResponse(text)
    } catch {
      setAiResponse('Failed to get AI response. Check your connection and try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const onGenerateQuestions = () => {
    if (!userPreferences.subject || !userPreferences.educationLevel || !userPreferences.questionType || !userPreferences.difficulty) {
      alert('Please complete the onboarding process first to generate personalized questions.')
      return
    }
    setShowQuestionCountDialog(true)
  }

  const onConfirmGenerateQuestions = async () => {
    setShowQuestionCountDialog(false)
    setGeneratingQuestions(true)

    try {
      const questions = await generateQuestions(
        userPreferences.subject!,
        userPreferences.educationLevel!,
        userPreferences.questionType!,
        userPreferences.difficulty!,
        selectedQuestionCount
      )
      setAiQuestions(questions)
      setShowAiQuestions(true)
      setProblemIndex(0)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate questions')
    } finally {
      setGeneratingQuestions(false)
    }
  }



  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px,1fr,300px]"
    >
      {/* Left: Topics */}
      <aside className="rounded-xl border border-border bg-card">
        <div className="px-4 py-3">
          <div className="text-sm font-semibold">Problems</div>
          <div className="mt-1 text-xs text-muted">{solvedCount}/{totalProblems} solved</div>
        </div>
        <Separator />

        {/* Difficulty Filter */}
        <div className="border-b border-border px-3 py-2">
          <Tabs value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as typeof difficultyFilter)}>
            <TabsList className="w-full">
              <TabsTrigger value="All" className="flex-1 text-xs">All</TabsTrigger>
              <TabsTrigger value="Easy" className="flex-1 text-xs text-easy">Easy</TabsTrigger>
              <TabsTrigger value="Medium" className="flex-1 text-xs text-medium">Med</TabsTrigger>
              <TabsTrigger value="Hard" className="flex-1 text-xs text-hard">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* AI Question Generation */}
        <div className="border-b border-border px-3 py-3">
          <Button
            onClick={onGenerateQuestions}
            disabled={generatingQuestions}
            className="w-full"
            variant="premium"
          >
            {generatingQuestions ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Questions
              </>
            )}
          </Button>
          {showAiQuestions && (
            <Button
              onClick={() => setShowAiQuestions(false)}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              Show Static Questions
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px] lg:h-[calc(100vh-250px)]">
          <div className="p-2">
            {groups.map((g) => {
              const open = openSubjects[g.subject]
              return (
                <Collapsible
                  key={g.subject}
                  open={open}
                  onOpenChange={(v) => setOpenSubjects((p) => ({ ...p, [g.subject]: v }))}
                >
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-text hover:bg-hover">
                      <span>{g.subject}</span>
                      <span className="text-muted">{open ? '▾' : '▸'}</span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 space-y-1 px-1 pb-2">
                      {g.topics.map((t) => {
                        const active = t.id === activeTopicId
                        const topicSolvedCount = t.problems.filter(p => isProblemSolved(p.id)).length
                        return (
                          <button
                            key={t.id}
                            onClick={() => setActiveTopicId(t.id)}
                            className={cn(
                              'w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                              active
                                ? 'border-primary bg-primary/10 text-text'
                                : 'border-transparent text-muted hover:bg-hover hover:text-text',
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span>{t.title}</span>
                              <span className="text-xs text-muted">{topicSolvedCount}/{t.problems.length}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Center: Workspace */}
      <section className="rounded-xl border border-border bg-card">
        <div className="px-5 py-4">
          {/* Problem Header */}
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{activeTopic.subject}</span>
            <span>/</span>
            <span>{activeTopic.title}</span>
          </div>

          {problem ? (
            <>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold tracking-tight">{problem.title}</h2>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted">
                    {problemIndex + 1}/{filteredProblems.length}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProblemIndex((i) => Math.max(0, i - 1))}
                    disabled={problemIndex === 0}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setProblemIndex((i) => Math.min(filteredProblems.length - 1, i + 1))
                    }
                    disabled={problemIndex >= filteredProblems.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Tags & Acceptance */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {problem.tags?.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-hover px-2 py-0.5 text-xs text-muted">
                    {tag}
                  </span>
                ))}
                {problem.acceptance && (
                  <span className="text-xs text-muted">
                    • {problem.acceptance}% acceptance
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm text-text leading-relaxed">{problem.statement}</p>

              {/* MCQ Options */}
              {problem.questionType === 'MCQ' && problem.options && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-muted">Choose your answer:</div>
                  <div className="grid gap-2">
                    {problem.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant={answer === option ? 'premium' : 'outline'}
                        className="justify-start h-auto p-3 text-left"
                        onClick={() => setAnswer(option)}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular input for non-MCQ questions */}
              {problem.questionType !== 'MCQ' && (
                <div className="mt-6">
                  <div className="text-xs font-medium text-muted">Your answer</div>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={problem.placeholder ?? 'Type your answer'}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onCheck()
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={onCheck}>
                  Submit
                </Button>
                <Button variant="outline" onClick={onExplain}>
                  Solution
                </Button>
                <Button
                  variant="premium"
                  onClick={onAskAI}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Hint
                </Button>
              </div>

              {checked && (
                <div
                  className={cn(
                    'mt-3 rounded-xl border px-3 py-2 text-sm flex items-center gap-2',
                    checked.ok ? 'border-success/60 bg-success/10 text-success' : 'border-border text-muted',
                  )}
                >
                  {checked.ok ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {checked.msg}
                </div>
              )}

              {/* AI Panel */}
              <AnimatePresence initial={false}>
                {showAiPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="mt-4"
                  >
                    <Card className="bg-bg/60 border-primary/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Sparkles className="h-4 w-4 text-primary" />
                          AI Hint
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {aiLoading ? (
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Thinking...
                          </div>
                        ) : (
                          <p className="text-sm text-text leading-relaxed">{aiResponse}</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Solution Steps */}
              <AnimatePresence initial={false}>
                {showSteps && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="mt-4"
                  >
                    <Card className="bg-transparent">
                      <CardHeader>
                        <CardTitle>Solution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-xl border border-border bg-bg/40 p-4 font-mono text-[13px] leading-relaxed text-text">
                          {problem.steps.map((s: string) => (
                            <div key={s} className="py-1">
                              {s}
                            </div>
                          ))}
                          <div className="mt-3 pt-3 border-t border-border text-success">
                            Answer: {problem.answer}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="py-8 text-center text-muted">
              No problems match the selected filter.
            </div>
          )}
        </div>
      </section>

      {/* Right: Progress & Stats */}
      <aside className="space-y-4">
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Solved Count - Unacademy style */}
            <div className="rounded-xl border border-border bg-bg/30 p-4 text-center">
              <div className="text-3xl font-bold text-primary">{solvedCount}</div>
              <div className="text-xs text-muted">Problems Solved</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-border bg-bg/30 p-2 text-center">
                <div className="text-lg font-semibold">{xp}</div>
                <div className="text-[10px] text-muted">XP</div>
              </div>
              <div className="rounded-xl border border-border bg-bg/30 p-2 text-center">
                <div className="text-lg font-semibold">{level}</div>
                <div className="text-[10px] text-muted">Level</div>
              </div>
              <div className="rounded-xl border border-border bg-bg/30 p-2 text-center">
                <div className="text-lg font-semibold">{streak}</div>
                <div className="text-[10px] text-muted">Streak</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Level {level} → {level + 1}</span>
                <span>{xpIntoLevel}/100</span>
              </div>
              <div className="mt-2">
                <Progress value={xpIntoLevel} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem Status Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-muted">Solved</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-4 w-4 text-medium" />
              <span className="text-muted">Attempted</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Circle className="h-4 w-4 text-muted" />
              <span className="text-muted">Todo</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-muted">Completed topics</div>
            {completedToday.length === 0 ? (
              <div className="text-sm text-muted">No completions yet.</div>
            ) : (
              <ul className="space-y-2">
                {completedToday.map((id) => {
                  const t = TOPICS.find((x) => x.id === id)
                  return (
                    <li key={id} className="rounded-xl border border-border bg-bg/30 px-3 py-2 text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {t ? `${t.subject} · ${t.title}` : id}
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </aside>

      {/* Question Count Selection Dialog */}
      <Dialog open={showQuestionCountDialog} onOpenChange={setShowQuestionCountDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How many questions would you like to practice?</DialogTitle>
            <DialogDescription>
              Choose between 1 and 20 questions. AI will generate personalized questions based on your preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <label htmlFor="question-count" className="text-sm font-medium">
                Number of questions:
              </label>
              <Input
                id="question-count"
                type="number"
                min="1"
                max="20"
                value={selectedQuestionCount}
                onChange={(e) => setSelectedQuestionCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20"
              />
            </div>
            <div className="text-xs text-muted">
              Recommended: 5-10 questions for a good practice session
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuestionCountDialog(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirmGenerateQuestions} disabled={generatingQuestions}>
              Generate Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
