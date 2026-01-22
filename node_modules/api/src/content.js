export const TOPICS = [
  {
    id: 'math-gcd-lcm',
    subject: 'Maths',
    title: 'GCD & LCM',
    problems: [
      {
        id: 'gcd-24-36',
        title: 'Find the GCD of 24 and 36',
        statement: 'Compute the greatest common divisor (GCD) of 24 and 36.',
        answer: '12',
        steps: [
          'Step 1: List factors of 24 → 1, 2, 3, 4, 6, 8, 12, 24',
          'Step 2: List factors of 36 → 1, 2, 3, 4, 6, 9, 12, 18, 36',
          'Step 3: The largest common factor is 12',
        ],
      },
    ],
  },
  {
    id: 'code-arrays',
    subject: 'Coding',
    title: 'Arrays',
    problems: [
      {
        id: 'array-indexing',
        title: 'Zero-based indexing',
        statement: 'Given the array [10, 20, 30, 40], what value is at index 2?',
        answer: '30',
        steps: [
          'Step 1: Arrays are zero-based → index 0 is the first element',
          'Step 2: Map indices → 0→10, 1→20, 2→30, 3→40',
          'Step 3: Value at index 2 is 30',
        ],
      },
    ],
  },
]

export function topicsSummary() {
  return TOPICS.map((t) => ({
    id: t.id,
    subject: t.subject,
    title: t.title,
    problemCount: t.problems.length,
  }))
}


