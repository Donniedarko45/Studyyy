import * as React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, ChevronLeft } from 'lucide-react'
import { GoogleGenAI } from "@google/genai"

import { TOPICS, normalizeAnswer, type Problem as ProblemType } from '@/data/content'
import { useProgress } from '@/state/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { DifficultyBadge } from '@/components/ui/difficulty-badge'
import { cn } from '@/lib/utils'

// Get all problems with navigation info
function getAllProblemsWithNav() {
    const all: Array<ProblemType & { topicTitle: string; subject: string; topicId: string }> = []
    for (const topic of TOPICS) {
        for (const problem of topic.problems) {
            all.push({
                ...problem,
                topicId: topic.id,
                topicTitle: topic.title,
                subject: topic.subject,
            })
        }
    }
    return all
}

export function ProblemPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { xp, level, xpIntoLevel, solvedCount, addXp, markAttempted, isProblemSolved } = useProgress()

    const allProblems = React.useMemo(() => getAllProblemsWithNav(), [])
    const currentIndex = allProblems.findIndex(p => p.id === id)
    const problem = allProblems[currentIndex]
    const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null
    const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null

    const [answer, setAnswer] = React.useState('')
    const [checked, setChecked] = React.useState<null | { ok: boolean; msg: string }>(null)
    const [showSteps, setShowSteps] = React.useState(false)
    const [stepsXpAwarded, setStepsXpAwarded] = React.useState(false)
    const [correctAwarded, setCorrectAwarded] = React.useState(false)

    // AI Chat state
    const [showAiPanel, setShowAiPanel] = React.useState(false)
    const [aiResponse, setAiResponse] = React.useState('')
    const [aiLoading, setAiLoading] = React.useState(false)

    // Reset state when problem changes
    React.useEffect(() => {
        setAnswer('')
        setChecked(null)
        setShowSteps(false)
        setStepsXpAwarded(false)
        setCorrectAwarded(false)
        setShowAiPanel(false)
        setAiResponse('')
    }, [id])

    // Mark as attempted when typing
    React.useEffect(() => {
        if (answer.trim() && problem) {
            markAttempted(problem.id)
        }
    }, [answer, problem, markAttempted])

    if (!problem) {
        return (
            <main className="mx-auto w-full max-w-4xl px-4 py-12 text-center">
                <h1 className="text-xl font-semibold">Problem not found</h1>
                <Link to="/problems" className="mt-4 text-link hover:underline">
                    ← Back to Problems
                </Link>
            </main>
        )
    }

    const onCheck = () => {
        const ok = normalizeAnswer(answer) === normalizeAnswer(problem.answer)
        setChecked(ok ? { ok: true, msg: 'Correct! +10 XP' } : { ok: false, msg: 'Not quite — try again.' })

        if (ok && !correctAwarded) {
            setCorrectAwarded(true)
            addXp(10, { solvedTopicId: problem.topicId, markCompleted: true, problemId: problem.id })
        }
    }

    const onExplain = () => {
        setShowSteps((v) => !v)
        if (!stepsXpAwarded) {
            setStepsXpAwarded(true)
            addXp(5)
        }
    }

    const onAskAI = async () => {
        setShowAiPanel(true)
        setAiLoading(true)
        setAiResponse('')

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            if (!apiKey) {
                setAiResponse('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.')
                setAiLoading(false)
                return
            }

            const prompt = `You are an educational AI tutor. A student is stuck on this problem:

Problem: ${problem.title}
Statement: ${problem.statement}
Difficulty: ${problem.difficulty}

Provide a helpful hint WITHOUT giving the direct answer. Guide them towards understanding. Keep it concise (2-3 sentences).`

            const ai = new GoogleGenAI({ apiKey })

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            })

            const text = response.text || 'Unable to generate hint.'
            setAiResponse(text)
        } catch {
            setAiResponse('Failed to get AI response. Check your connection.')
        } finally {
            setAiLoading(false)
        }
    }

    const isSolved = isProblemSolved(problem.id)

    return (
        <main id="main" tabIndex={-1} className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr,300px]">
            {/* Main Content */}
            <div className="space-y-4">
                {/* Breadcrumb & Navigation */}
                <div className="flex items-center justify-between">
                    <Link to="/problems" className="flex items-center gap-1 text-sm text-muted hover:text-text">
                        <ChevronLeft className="h-4 w-4" />
                        Problems
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => prevProblem && navigate(`/problems/${prevProblem.id}`)}
                            disabled={!prevProblem}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted">
                            {currentIndex + 1} / {allProblems.length}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => nextProblem && navigate(`/problems/${nextProblem.id}`)}
                            disabled={!nextProblem}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Problem Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            {isSolved && <CheckCircle2 className="h-5 w-5 text-success" />}
                            <CardTitle className="text-xl">{problem.title}</CardTitle>
                            <DifficultyBadge difficulty={problem.difficulty} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                            <span>{problem.subject} / {problem.topicTitle}</span>
                            {problem.tags?.map(tag => (
                                <span key={tag} className="rounded-full bg-hover px-2 py-0.5">{tag}</span>
                            ))}
                            {problem.acceptance && <span>• {problem.acceptance}% acceptance</span>}
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                        <p className="text-sm leading-relaxed text-text">{problem.statement}</p>

                        {/* Answer Input */}
                        <div className="mt-6">
                            <div className="text-xs font-medium text-muted">Your answer</div>
                            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Input
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder={problem.placeholder ?? 'Type your answer'}
                                    onKeyDown={(e) => e.key === 'Enter' && onCheck()}
                                    className="flex-1"
                                />
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={onCheck}>Submit</Button>
                                    <Button variant="outline" onClick={onExplain}>Solution</Button>
                                    <Button variant="premium" onClick={onAskAI} className="flex items-center gap-1">
                                        <Sparkles className="h-4 w-4" />
                                        AI Hint
                                    </Button>
                                </div>
                            </div>

                            {checked && (
                                <div className={cn(
                                    'mt-3 rounded-xl border px-3 py-2 text-sm flex items-center gap-2',
                                    checked.ok ? 'border-success/60 bg-success/10 text-success' : 'border-border text-muted'
                                )}>
                                    {checked.ok && <CheckCircle2 className="h-4 w-4" />}
                                    {checked.msg}
                                </div>
                            )}
                        </div>

                        {/* AI Panel */}
                        <AnimatePresence initial={false}>
                            {showAiPanel && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
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
                                    className="mt-4"
                                >
                                    <Card className="bg-transparent">
                                        <CardHeader>
                                            <CardTitle>Solution</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="rounded-xl border border-border bg-bg/40 p-4 font-mono text-[13px] leading-relaxed">
                                                {problem.steps.map((s) => (
                                                    <div key={s} className="py-1">{s}</div>
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
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-xl border border-border bg-bg/30 p-4 text-center">
                            <div className="text-3xl font-bold text-primary">{solvedCount}</div>
                            <div className="text-xs text-muted">Problems Solved</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-border bg-bg/30 p-2 text-center">
                                <div className="text-lg font-semibold">{xp}</div>
                                <div className="text-[10px] text-muted">XP</div>
                            </div>
                            <div className="rounded-xl border border-border bg-bg/30 p-2 text-center">
                                <div className="text-lg font-semibold">{level}</div>
                                <div className="text-[10px] text-muted">Level</div>
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

                {/* Quick Navigation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Jump</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 max-h-[300px] overflow-y-auto">
                        {allProblems.slice(0, 10).map((p, i) => (
                            <Link
                                key={p.id}
                                to={`/problems/${p.id}`}
                                className={cn(
                                    'block rounded-lg px-2 py-1.5 text-xs transition-colors',
                                    p.id === id ? 'bg-primary/20 text-text' : 'text-muted hover:bg-hover hover:text-text'
                                )}
                            >
                                {i + 1}. {p.title}
                            </Link>
                        ))}
                        {allProblems.length > 10 && (
                            <Link to="/problems" className="block pt-2 text-xs text-link hover:underline">
                                View all {allProblems.length} problems →
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </aside>
        </main>
    )
}
