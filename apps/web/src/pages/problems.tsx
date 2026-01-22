import * as React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react'

import { TOPICS, getTotalProblems, type Difficulty, type Subject } from '@/data/content'
import { useProgress } from '@/state/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DifficultyBadge } from '@/components/ui/difficulty-badge'
import { cn } from '@/lib/utils'

const PROBLEMS_PER_PAGE = 10

// Flatten all problems with topic info
function getAllProblems() {
    return TOPICS.flatMap(topic =>
        topic.problems.map(problem => ({
            ...problem,
            topicId: topic.id,
            topicTitle: topic.title,
            subject: topic.subject,
        }))
    )
}

// Get unique topics grouped by subject
function getTopicsBySubject() {
    const result: Record<Subject, string[]> = { Maths: [], Science: [], Coding: [] }
    for (const topic of TOPICS) {
        if (!result[topic.subject].includes(topic.title)) {
            result[topic.subject].push(topic.title)
        }
    }
    return result
}

export function ProblemsPage() {
    const { solvedCount, isProblemSolved, isProblemAttempted } = useProgress()
    const totalProblems = getTotalProblems()
    const allProblems = React.useMemo(() => getAllProblems(), [])
    const topicsBySubject = React.useMemo(() => getTopicsBySubject(), [])

    // Filters
    const [search, setSearch] = React.useState('')
    const [difficultyFilter, setDifficultyFilter] = React.useState<'All' | Difficulty>('All')
    const [subjectFilter, setSubjectFilter] = React.useState<'All' | Subject>('All')
    const [topicFilter, setTopicFilter] = React.useState<string>('All')
    const [currentPage, setCurrentPage] = React.useState(1)

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [search, difficultyFilter, subjectFilter, topicFilter])

    // Reset topic filter when subject changes
    React.useEffect(() => {
        setTopicFilter('All')
    }, [subjectFilter])

    // Filtered problems
    const filteredProblems = React.useMemo(() => {
        return allProblems.filter(p => {
            // Search filter
            if (search.trim()) {
                const q = search.toLowerCase()
                const match = p.title.toLowerCase().includes(q) ||
                    p.topicTitle.toLowerCase().includes(q) ||
                    p.tags?.some(t => t.toLowerCase().includes(q))
                if (!match) return false
            }
            // Difficulty filter
            if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false
            // Subject filter
            if (subjectFilter !== 'All' && p.subject !== subjectFilter) return false
            // Topic filter
            if (topicFilter !== 'All' && p.topicTitle !== topicFilter) return false
            return true
        })
    }, [allProblems, search, difficultyFilter, subjectFilter, topicFilter])

    // Pagination
    const totalPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE)
    const paginatedProblems = filteredProblems.slice(
        (currentPage - 1) * PROBLEMS_PER_PAGE,
        currentPage * PROBLEMS_PER_PAGE
    )

    const getStatus = (problemId: string) => {
        if (isProblemSolved(problemId)) return 'solved'
        if (isProblemAttempted(problemId)) return 'attempted'
        return 'todo'
    }

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'solved') return <CheckCircle2 className="h-4 w-4 text-success" />
        if (status === 'attempted') return <Clock className="h-4 w-4 text-medium" />
        return <Circle className="h-4 w-4 text-muted" />
    }

    // Available topics for current subject
    const availableTopics = subjectFilter === 'All'
        ? [...topicsBySubject.Maths, ...topicsBySubject.Science, ...topicsBySubject.Coding]
        : topicsBySubject[subjectFilter]

    return (
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Problems</h1>
                    <p className="mt-1 text-sm text-muted">
                        {solvedCount} / {totalProblems} solved
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Progress value={(solvedCount / totalProblems) * 100} className="w-32" />
                </div>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                    placeholder="Search problems by name, topic, or tag..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Filters Row */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                {/* Difficulty */}
                <Tabs value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as typeof difficultyFilter)}>
                    <TabsList>
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Easy" className="text-easy">Easy</TabsTrigger>
                        <TabsTrigger value="Medium" className="text-medium">Medium</TabsTrigger>
                        <TabsTrigger value="Hard" className="text-hard">Hard</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Subject */}
                <Tabs value={subjectFilter} onValueChange={(v) => setSubjectFilter(v as typeof subjectFilter)}>
                    <TabsList>
                        <TabsTrigger value="All">All Subjects</TabsTrigger>
                        <TabsTrigger value="Maths">Maths</TabsTrigger>
                        <TabsTrigger value="Coding">Coding</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Topic Filter */}
            {subjectFilter !== 'All' && (
                <div className="mb-4 flex flex-wrap gap-2">
                    <Button
                        variant={topicFilter === 'All' ? 'premium' : 'outline'}
                        size="sm"
                        onClick={() => setTopicFilter('All')}
                    >
                        All Topics
                    </Button>
                    {availableTopics.map(topic => (
                        <Button
                            key={topic}
                            variant={topicFilter === topic ? 'premium' : 'outline'}
                            size="sm"
                            onClick={() => setTopicFilter(topic)}
                        >
                            {topic}
                        </Button>
                    ))}
                </div>
            )}

            {/* Results count */}
            <div className="mb-3 text-xs text-muted">
                Showing {paginatedProblems.length} of {filteredProblems.length} problems
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </div>

            {/* Problems Table */}
            <Card>
                <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="grid grid-cols-[40px,1fr,120px,100px,80px] gap-4 border-b border-border px-4 py-3 text-xs font-medium text-muted">
                        <span>Status</span>
                        <span>Title</span>
                        <span>Topic</span>
                        <span>Difficulty</span>
                        <span>Acceptance</span>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border">
                        {paginatedProblems.map((problem, index) => {
                            const status = getStatus(problem.id)
                            return (
                                <Link
                                    key={problem.id}
                                    to={`/problems/${problem.id}`}
                                    className={cn(
                                        'grid grid-cols-[40px,1fr,120px,100px,80px] gap-4 px-4 py-3 transition-colors hover:bg-hover',
                                        index % 2 === 0 ? 'bg-card' : 'bg-bg/50'
                                    )}
                                >
                                    <div className="flex items-center">
                                        <StatusIcon status={status} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-text">{problem.title}</span>
                                        {problem.tags && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {problem.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] text-muted">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-muted">
                                        {problem.topicTitle}
                                    </div>
                                    <div className="flex items-center">
                                        <DifficultyBadge difficulty={problem.difficulty} />
                                    </div>
                                    <div className="flex items-center text-xs text-muted">
                                        {problem.acceptance ?? '-'}%
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {paginatedProblems.length === 0 && (
                        <div className="py-12 text-center text-muted">
                            No problems match your search or filters.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number
                            if (totalPages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? 'premium' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="w-9"
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </main>
    )
}
