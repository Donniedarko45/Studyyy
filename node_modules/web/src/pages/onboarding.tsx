import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { Subject, EducationLevel, QuestionType, Difficulty } from '@/data/content'

type OnboardingData = {
  subject: Subject | null
  educationLevel: EducationLevel | null
  questionType: QuestionType | null
  difficulty: Difficulty | null
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    subject: null,
    educationLevel: null,
    questionType: null,
    difficulty: null,
  })

  const steps = [
    { title: 'Choose Subject', progress: 25 },
    { title: 'Education Level', progress: 50 },
    { title: 'Question Type', progress: 75 },
    { title: 'Difficulty', progress: 100 },
  ]

  const subjects: { value: Subject; label: string; icon: string }[] = [
    { value: 'Maths', label: 'Mathematics', icon: '🔢' },
    { value: 'Science', label: 'Science', icon: '🧪' },
    { value: 'Coding', label: 'Coding', icon: '💻' },
  ]

  const educationLevels: { value: EducationLevel; label: string }[] = [
    { value: 'Class 6-8', label: 'Class 6-8' },
    { value: 'Class 9-10', label: 'Class 9-10' },
    { value: 'Class 11-12', label: 'Class 11-12' },
    { value: 'BTECH', label: 'B.Tech/B.E.' },
    { value: 'MCA', label: 'MCA' },
    { value: 'BCA', label: 'BCA' },
  ]

  const questionTypes: { value: QuestionType; label: string; description: string }[] = [
    { value: 'MCQ', label: 'Multiple Choice', description: 'Choose from given options' },
    { value: 'Comprehension', label: 'Comprehension', description: 'Read and answer questions' },
    { value: 'Integer', label: 'Integer Type', description: 'Numerical answers only' },
    { value: 'Mixed', label: 'Mixed Questions', description: 'Variety of question types' },
  ]

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'Easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
    { value: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Hard', label: 'Hard', color: 'bg-red-100 text-red-800' },
  ]

  const updateData = (key: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // Save preferences and navigate to learning
      localStorage.setItem('userPreferences', JSON.stringify(data))
      navigate('/learn')
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What would you like to practice?</h2>
              <p className="text-muted-foreground">Choose your preferred subject area</p>
            </div>
            <div className="grid gap-4">
              {subjects.map((subject) => (
                <Card
                  key={subject.value}
                  className={`cursor-pointer transition-all ${
                    data.subject === subject.value
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => updateData('subject', subject.value)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{subject.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{subject.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          Practice {subject.label.toLowerCase()} problems
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What's your education level?</h2>
              <p className="text-muted-foreground">This helps us tailor questions to your level</p>
            </div>
            <div className="grid gap-3">
              {educationLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={data.educationLevel === level.value ? 'premium' : 'outline'}
                  className="h-auto p-4 justify-start"
                  onClick={() => updateData('educationLevel', level.value)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">How would you like to answer questions?</h2>
              <p className="text-muted-foreground">Choose your preferred question format</p>
            </div>
            <div className="grid gap-4">
              {questionTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all ${
                    data.questionType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => updateData('questionType', type.value)}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Select difficulty level</h2>
              <p className="text-muted-foreground">Start with easier questions and progress gradually</p>
            </div>
            <div className="grid gap-3">
              {difficulties.map((diff) => (
                <Button
                  key={diff.value}
                  variant={data.difficulty === diff.value ? 'premium' : 'outline'}
                  className="h-auto p-4 justify-start"
                  onClick={() => updateData('difficulty', diff.value)}
                >
                  <Badge className={`${diff.color} mr-3`}>{diff.label}</Badge>
                  <span>
                    {diff.value === 'Easy' && 'Perfect for beginners'}
                    {diff.value === 'Medium' && 'Balanced challenge'}
                    {diff.value === 'Hard' && 'Advanced problem-solving'}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return data.subject !== null
      case 1: return data.educationLevel !== null
      case 2: return data.questionType !== null
      case 3: return data.difficulty !== null
      default: return false
    }
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Let's personalize your learning</h1>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}
            </span>
          </div>
          <Progress value={steps[step].progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">{steps[step].title}</p>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            {step === steps.length - 1 ? 'Start Learning' : 'Next'}
          </Button>
        </div>
      </div>
    </main>
  )
}