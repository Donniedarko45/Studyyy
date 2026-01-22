import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function LandingPage() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4">
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Learn Maths ,Coding Or anything through practice, not lectures.
          </h1>
          <p className="mt-4 text-pretty text-base text-muted sm:text-lg">
            A gamified learning workspace with instant explanations.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="premium" size="lg">
              <Link to="/onboarding">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/learn">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Practice real problems</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              A focused workspace designed for structured problem-solving in maths and coding.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle/>
              <CardContent className=''>Step-by-step explanations</CardContent>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track XP, level & streak</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              Calm progress visuals to keep momentum without distracting animations.
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-sm text-muted">
        Built for focused practice. Open-source.
      </footer>
    </main>
  )
}


