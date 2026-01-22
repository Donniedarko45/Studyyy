import * as React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useProgress } from '@/state/progress'
import { getTotalProblems } from '@/data/content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function formatDayLabel(iso: string) {
  return iso.slice(5)
}

export function DashboardPage() {
  const { xp, level, xpIntoLevel, streak, xpByDay, solvedCount } = useProgress()
  const totalProblems = getTotalProblems()

  const chartData = React.useMemo(() => {
    const days = Object.keys(xpByDay).sort()
    const last = days.slice(-14)
    return last.map((d) => ({ day: formatDayLabel(d), xp: xpByDay[d] ?? 0 }))
  }, [xpByDay])

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-5">
        <div className="text-xs text-muted">Dashboard</div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Progress overview</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{solvedCount}</div>
            <div className="mt-2 text-xs text-muted">
              {totalProblems} total problems
            </div>
            <div className="mt-2">
              <Progress value={(solvedCount / totalProblems) * 100} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{xp}</div>
            <div className="mt-3 text-xs text-muted">
              Level {level} · {xpIntoLevel}/100 to next level
            </div>
            <div className="mt-2">
              <Progress value={xpIntoLevel} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{streak}</div>
            <div className="mt-2 text-sm text-muted">Keep a daily practice loop.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Maths</span>
                <span>{Math.min(100, Math.round((xp * 0.55) % 100))}%</span>
              </div>
              <div className="mt-2">
                <Progress value={Math.min(100, Math.round((xp * 0.55) % 100))} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Coding</span>
                <span>{Math.min(100, Math.round((xp * 0.45) % 100))}%</span>
              </div>
              <div className="mt-2">
                <Progress value={Math.min(100, Math.round((xp * 0.45) % 100))} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>XP over time</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fac31d" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#fac31d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(245,245,245,0.45)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(245,245,245,0.45)" tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: '#282828',
                    border: '1px solid #3c3c3c',
                    borderRadius: 12,
                    color: '#f5f5f5',
                  }}
                  labelStyle={{ color: '#949494' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#fac31d" fill="url(#xpFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <ul className="space-y-2">
                  <li className="rounded-xl border border-border bg-bg/30 px-3 py-2 text-sm">
                    First check-in: solve a problem (+10 XP)
                  </li>
                  <li className="rounded-xl border border-border bg-bg/30 px-3 py-2 text-sm">
                    Use steps intentionally (+5 XP)
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="milestones">
                <ul className="space-y-2">
                  <li className="rounded-xl border border-border bg-bg/30 px-3 py-2 text-sm">
                    Level up every 100 XP
                  </li>
                  <li className="rounded-xl border border-border bg-bg/30 px-3 py-2 text-sm">
                    Maintain a streak with daily practice
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


