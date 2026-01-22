import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function DocsPage() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-muted">Docs</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          How the practice workspace works
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Study-focused practice for maths and coding: pick a topic, solve problems, use steps when
          needed, and track XP, levels, and streak.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Scoring (UI only)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            Correct answer: +10 XP
            <br />
            Show steps: +5 XP
            <br />
            Level: +1 every 100 XP
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Explanations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            Steps render inline in a monospace block—documentation style, not chat style.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Keyboard</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            Use Tab to move through controls. Press Enter to check an answer from the input.
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="premium">
          <Link to="/learn">Start practicing</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Back to landing</Link>
        </Button>
      </div>
    </main>
  )
}


