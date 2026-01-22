import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ProgressProvider } from '@/state/progress'
import { AppTopbar } from '@/components/layout/app-topbar'
import { DashboardPage } from '@/pages/dashboard'
import { DocsPage } from '@/pages/docs'
import { LandingPage } from '@/pages/landing'
import { LearnPage } from '@/pages/learn'
import { OnboardingPage } from '@/pages/onboarding'
import { LeaderboardPage } from '@/pages/leaderboard'
import { ProblemsPage } from '@/pages/problems'
import { ProblemPage } from '@/pages/problem'

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg text-text">
          <AppTopbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:id" element={<ProblemPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<Navigate to="/problems" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProgressProvider>
  )
}
