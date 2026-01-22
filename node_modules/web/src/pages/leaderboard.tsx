import { useEffect, useState } from 'react'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface LeaderboardEntry {
  id: string
  name: string
  xp: number
  level: number
  solvedProblems: number
  streak: number
  subject: string
  rank: number
}

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [timeframe, setTimeframe] = useState<'all' | 'weekly' | 'monthly'>('all')

  useEffect(() => {
    // Load leaderboard data (in a real app, this would come from an API)
    const loadLeaderboard = () => {
      // Mock leaderboard data
      const mockData: LeaderboardEntry[] = [
        { id: '1', name: 'Alex Chen', xp: 2450, level: 12, solvedProblems: 89, streak: 15, subject: 'Coding', rank: 1 },
        { id: '2', name: 'Sarah Johnson', xp: 2200, level: 11, solvedProblems: 76, streak: 22, subject: 'Maths', rank: 2 },
        { id: '3', name: 'Mike Rodriguez', xp: 2100, level: 10, solvedProblems: 82, streak: 8, subject: 'Science', rank: 3 },
        { id: '4', name: 'Emma Wilson', xp: 1950, level: 9, solvedProblems: 71, streak: 12, subject: 'Coding', rank: 4 },
        { id: '5', name: 'David Kim', xp: 1800, level: 9, solvedProblems: 65, streak: 18, subject: 'Maths', rank: 5 },
        { id: '6', name: 'Lisa Zhang', xp: 1750, level: 8, solvedProblems: 68, streak: 9, subject: 'Science', rank: 6 },
        { id: '7', name: 'Tom Anderson', xp: 1600, level: 8, solvedProblems: 59, streak: 14, subject: 'Coding', rank: 7 },
        { id: '8', name: 'Anna Martinez', xp: 1550, level: 7, solvedProblems: 62, streak: 6, subject: 'Maths', rank: 8 },
        { id: '9', name: 'James Lee', xp: 1500, level: 7, solvedProblems: 55, streak: 11, subject: 'Science', rank: 9 },
        { id: '10', name: 'Sophie Brown', xp: 1450, level: 7, solvedProblems: 58, streak: 7, subject: 'Coding', rank: 10 },
      ]

      // Get current user data from localStorage
      const userProgress = localStorage.getItem('progress')
      if (userProgress) {
        const progress = JSON.parse(userProgress)
        const userEntry: LeaderboardEntry = {
          id: 'current-user',
          name: 'You',
          xp: progress.xp || 0,
          level: progress.level || 1,
          solvedProblems: progress.solvedCount || 0,
          streak: progress.streak || 0,
          subject: 'Mixed',
          rank: 0 // Will be calculated
        }

        // Insert user into leaderboard based on XP
        const sortedData = [...mockData].sort((a, b) => b.xp - a.xp)
        const userRank = sortedData.findIndex(entry => entry.xp < userEntry.xp) + 1

        if (userRank === 0) {
          // User has highest score
          userEntry.rank = 1
          sortedData.unshift(userEntry)
          sortedData.forEach((entry, index) => entry.rank = index + 1)
        } else {
          // Insert user at correct position
          sortedData.splice(userRank - 1, 0, userEntry)
          sortedData.forEach((entry, index) => entry.rank = index + 1)
        }

        setUserRank(userEntry)
        setLeaderboard(sortedData.slice(0, 20)) // Show top 20
      } else {
        setLeaderboard(mockData)
      }
    }

    loadLeaderboard()
  }, [timeframe])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Trophy className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Maths':
        return 'bg-blue-100 text-blue-800'
      case 'Science':
        return 'bg-green-100 text-green-800'
      case 'Coding':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-bg p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">🏆 Global Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among other learners</p>

          {/* Timeframe selector */}
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant={timeframe === 'all' ? 'premium' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('all')}
            >
              All Time
            </Button>
            <Button
              variant={timeframe === 'weekly' ? 'premium' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('weekly')}
            >
              This Week
            </Button>
            <Button
              variant={timeframe === 'monthly' ? 'premium' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('monthly')}
            >
              This Month
            </Button>
          </div>
        </div>

        {/* User's rank card */}
        {userRank && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(userRank.rank)}
                    <span className="text-2xl font-bold">#{userRank.rank}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{userRank.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Level {userRank.level} • {userRank.xp} XP
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>{userRank.solvedProblems} problems solved</div>
                  <div>{userRank.streak} day streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Top Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    entry.id === 'current-user'
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {getRankIcon(entry.rank)}
                      <span className="font-bold text-lg">#{entry.rank}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{entry.name}</span>
                        {entry.id === 'current-user' && (
                          <Badge variant="primary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Level {entry.level}</span>
                        <span>{entry.xp} XP</span>
                        <span>{entry.solvedProblems} solved</span>
                        <span>{entry.streak} streak</span>
                      </div>
                    </div>
                  </div>

                  <Badge className={getSubjectColor(entry.subject)}>
                    {entry.subject}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {leaderboard.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.max(...leaderboard.map(e => e.xp))}
              </div>
              <div className="text-sm text-muted-foreground">Highest XP</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.max(...leaderboard.map(e => e.streak))}
              </div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}