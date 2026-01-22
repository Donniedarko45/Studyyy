import { Link, NavLink, useLocation } from 'react-router-dom'
import { Github } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'

const navLinkBase =
  'text-sm text-muted hover:text-text transition-colors rounded-xl px-3 py-2'

export function AppTopbar() {
  const loc = useLocation()
  const isLanding = loc.pathname === '/'

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 rounded-xl border border-border bg-card px-3 py-2 text-sm text-text"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="text-[15px]" />
          <div className="hidden sm:block text-xs text-muted">
            Focused practice workspace
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {isLanding ? (
            <>
              <NavLink
                to="/docs"
                className={({ isActive }) =>
                  cn(navLinkBase, isActive && 'text-text bg-white/5')
                }
              >
                Docs
              </NavLink>
              <a
                className={cn(navLinkBase)}
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <Button asChild variant="premium" size="sm" className="ml-2">
                <Link to="/login">Login</Link>
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  cn(navLinkBase, isActive && 'text-text bg-white/5')
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/problems"
                className={({ isActive }) =>
                  cn(navLinkBase, isActive && 'text-text bg-white/5')
                }
              >
                Problems
              </NavLink>
              <NavLink
                to="/learn"
                className={({ isActive }) =>
                  cn(navLinkBase, isActive && 'text-text bg-white/5')
                }
              >
                Practice
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  cn(navLinkBase, isActive && 'text-text bg-white/5')
                }
              >
                Leaderboard
              </NavLink>
              <Button variant="outline" size="sm" className="ml-2 hidden sm:inline-flex" asChild>
                <a href="https://github.com/" target="_blank" rel="noreferrer">
                  <Github className="mr-1.5 size-4" />
                  GitHub
                </a>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


