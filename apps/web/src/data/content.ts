export type Subject = 'Maths' | 'Science' | 'Coding'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type EducationLevel = 'Class 6-8' | 'Class 9-10' | 'Class 11-12' | 'BTECH' | 'MCA' | 'BCA'
export type QuestionType = 'MCQ' | 'Comprehension' | 'Integer' | 'Mixed'

export type Problem = {
  id: string
  title: string
  statement: string
  placeholder?: string
  answer: string
  steps: string[]
  difficulty: Difficulty
  tags?: string[]
  acceptance?: number
  questionType?: QuestionType
  educationLevel?: EducationLevel[]
  // For MCQ questions
  options?: string[]
  // For comprehension questions
  passage?: string
}

export type Topic = {
  id: string
  subject: Subject
  title: string
  problems: Problem[]
}

export const TOPICS: Topic[] = [
  // === MATHS ===
  {
    id: 'math-gcd-lcm',
    subject: 'Maths',
    title: 'GCD & LCM',
    problems: [
      {
        id: 'gcd-24-36',
        title: 'Find the GCD of 24 and 36',
        statement: 'Compute the greatest common divisor (GCD) of 24 and 36.',
        placeholder: 'Type a number (e.g., 12)',
        answer: '12',
        difficulty: 'Easy',
        tags: ['Number Theory', 'Basic Math'],
        acceptance: 78,
        steps: [
          'Step 1: List factors of 24 → 1, 2, 3, 4, 6, 8, 12, 24',
          'Step 2: List factors of 36 → 1, 2, 3, 4, 6, 9, 12, 18, 36',
          'Step 3: The largest common factor is 12',
        ],
      },
      {
        id: 'lcm-6-14',
        title: 'Find the LCM of 6 and 14',
        statement: 'Compute the least common multiple (LCM) of 6 and 14.',
        placeholder: 'Type a number (e.g., 42)',
        answer: '42',
        difficulty: 'Easy',
        tags: ['Number Theory', 'Basic Math'],
        acceptance: 72,
        steps: [
          'Step 1: Prime factorize 6 → 2 × 3',
          'Step 2: Prime factorize 14 → 2 × 7',
          'Step 3: Take highest powers of each prime → 2 × 3 × 7',
          'Step 4: LCM = 42',
        ],
      },
      {
        id: 'gcd-euclidean',
        title: 'GCD using Euclidean Algorithm',
        statement: 'Find the GCD of 48 and 18 using the Euclidean algorithm. What is the result?',
        placeholder: 'Type a number',
        answer: '6',
        difficulty: 'Medium',
        tags: ['Number Theory', 'Algorithms'],
        acceptance: 54,
        steps: [
          'Step 1: 48 = 18 × 2 + 12',
          'Step 2: 18 = 12 × 1 + 6',
          'Step 3: 12 = 6 × 2 + 0',
          'Step 4: GCD = 6 (last non-zero remainder)',
        ],
      },
    ],
  },
  {
    id: 'math-primes',
    subject: 'Maths',
    title: 'Prime Numbers',
    problems: [
      {
        id: 'is-29-prime',
        title: 'Is 29 prime?',
        statement: 'Answer with "prime" or "not prime".',
        placeholder: 'prime / not prime',
        answer: 'prime',
        difficulty: 'Easy',
        tags: ['Number Theory', 'Primes'],
        acceptance: 85,
        steps: [
          'Step 1: Check divisibility by primes ≤ √29 (≈ 5.38) → 2, 3, 5',
          'Step 2: 29 is not divisible by 2, 3, or 5',
          'Step 3: Therefore, 29 is prime',
        ],
      },
      {
        id: 'prime-factorization-60',
        title: 'Prime Factorization of 60',
        statement: 'What is the prime factorization of 60? Write as "2^a × 3^b × 5^c" (e.g., 2^2 × 3^1 × 5^1)',
        placeholder: '2^? × 3^? × 5^?',
        answer: '2^2 × 3^1 × 5^1',
        difficulty: 'Medium',
        tags: ['Number Theory', 'Primes'],
        acceptance: 48,
        steps: [
          'Step 1: 60 ÷ 2 = 30',
          'Step 2: 30 ÷ 2 = 15',
          'Step 3: 15 ÷ 3 = 5',
          'Step 4: 5 ÷ 5 = 1',
          'Step 5: 60 = 2² × 3¹ × 5¹',
        ],
      },
      {
        id: 'sieve-count',
        title: 'Count Primes Below 20',
        statement: 'How many prime numbers are there less than 20?',
        placeholder: 'Type a number',
        answer: '8',
        difficulty: 'Easy',
        tags: ['Number Theory', 'Primes'],
        acceptance: 68,
        steps: [
          'Step 1: List primes < 20: 2, 3, 5, 7, 11, 13, 17, 19',
          'Step 2: Count = 8',
        ],
      },
    ],
  },
  {
    id: 'math-algebra',
    subject: 'Maths',
    title: 'Algebra',
    problems: [
      {
        id: 'quadratic-roots',
        title: 'Solve Quadratic Equation',
        statement: 'Find the roots of x² - 5x + 6 = 0. Enter the smaller root.',
        placeholder: 'Type a number',
        answer: '2',
        difficulty: 'Medium',
        tags: ['Algebra', 'Quadratic'],
        acceptance: 56,
        steps: [
          'Step 1: Factor: x² - 5x + 6 = (x - 2)(x - 3)',
          'Step 2: Set each factor to 0: x = 2 or x = 3',
          'Step 3: Smaller root = 2',
        ],
      },
      {
        id: 'linear-equation',
        title: 'Solve Linear Equation',
        statement: 'Solve for x: 3x + 7 = 22',
        placeholder: 'Type a number',
        answer: '5',
        difficulty: 'Easy',
        tags: ['Algebra', 'Linear'],
        acceptance: 89,
        steps: [
          'Step 1: Subtract 7 from both sides: 3x = 15',
          'Step 2: Divide by 3: x = 5',
        ],
      },
    ],
  },

  // === SCIENCE ===
  {
    id: 'science-physics',
    subject: 'Science',
    title: 'Physics Basics',
    problems: [
      {
        id: 'force-newton',
        title: 'Newton\'s Second Law',
        statement: 'What is the unit of force in the SI system?',
        placeholder: 'Type the unit',
        answer: 'newton',
        difficulty: 'Easy',
        questionType: 'Integer',
        educationLevel: ['Class 9-10', 'Class 11-12', 'BTECH'],
        tags: ['Physics', 'Basic'],
        acceptance: 89,
        steps: [
          'Step 1: Force is mass × acceleration',
          'Step 2: SI unit: kg × m/s² = Newton (N)',
        ],
      },
      {
        id: 'energy-types',
        title: 'Types of Energy',
        statement: 'Which of the following is NOT a form of energy?',
        placeholder: 'Select the correct option',
        answer: 'Mass',
        questionType: 'MCQ',
        options: ['Kinetic', 'Potential', 'Mass', 'Thermal'],
        difficulty: 'Easy',
        educationLevel: ['Class 6-8', 'Class 9-10'],
        tags: ['Physics', 'Energy'],
        acceptance: 75,
        steps: [
          'Step 1: Kinetic energy is energy of motion',
          'Step 2: Potential energy is stored energy',
          'Step 3: Thermal energy is heat energy',
          'Step 4: Mass is not a form of energy',
        ],
      },
      {
        id: 'speed-calculation',
        title: 'Calculate Average Speed',
        statement: 'A car travels 120 km in 2 hours. What is its average speed?',
        placeholder: 'Type a number with unit',
        answer: '60 km/h',
        difficulty: 'Easy',
        questionType: 'Integer',
        educationLevel: ['Class 6-8', 'Class 9-10'],
        tags: ['Physics', 'Motion'],
        acceptance: 82,
        steps: [
          'Step 1: Speed = Distance / Time',
          'Step 2: Speed = 120 km / 2 h = 60 km/h',
        ],
      },
    ],
  },
  {
    id: 'science-chemistry',
    subject: 'Science',
    title: 'Chemistry Basics',
    problems: [
      {
        id: 'periodic-table',
        title: 'Elements in Periodic Table',
        statement: 'How many elements are there in the first period of the periodic table?',
        placeholder: 'Type a number',
        answer: '2',
        difficulty: 'Easy',
        questionType: 'Integer',
        educationLevel: ['Class 9-10', 'Class 11-12'],
        tags: ['Chemistry', 'Periodic Table'],
        acceptance: 91,
        steps: [
          'Step 1: First period contains Hydrogen (H) and Helium (He)',
          'Step 2: Only 2 elements in period 1',
        ],
      },
      {
        id: 'chemical-reaction',
        title: 'Identify Reaction Type',
        statement: '2H₂ + O₂ → 2H₂O is an example of which type of reaction?',
        placeholder: 'Select the correct option',
        answer: 'Combination',
        questionType: 'MCQ',
        options: ['Decomposition', 'Combination', 'Displacement', 'Combustion'],
        difficulty: 'Medium',
        educationLevel: ['Class 9-10', 'Class 11-12'],
        tags: ['Chemistry', 'Reactions'],
        acceptance: 68,
        steps: [
          'Step 1: Two or more reactants combine to form a single product',
          'Step 2: This is a combination reaction',
        ],
      },
    ],
  },
  {
    id: 'science-biology',
    subject: 'Science',
    title: 'Biology Basics',
    problems: [
      {
        id: 'cell-theory',
        title: 'Cell Theory',
        statement: 'Who proposed the cell theory along with Theodor Schwann?',
        placeholder: 'Type the name',
        answer: 'Matthias Schleiden',
        difficulty: 'Medium',
        questionType: 'Comprehension',
        educationLevel: ['Class 9-10', 'Class 11-12'],
        tags: ['Biology', 'Cell'],
        acceptance: 54,
        steps: [
          'Step 1: Cell theory was proposed by Matthias Schleiden and Theodor Schwann',
          'Step 2: Schleiden studied plant cells, Schwann studied animal cells',
        ],
      },
      {
        id: 'photosynthesis',
        title: 'Photosynthesis Equation',
        statement: 'Complete the photosynthesis equation: 6CO₂ + 6H₂O → ?',
        placeholder: 'Type the complete equation',
        answer: 'C₆H₁₂O₆ + 6O₂',
        difficulty: 'Medium',
        questionType: 'Integer',
        educationLevel: ['Class 9-10', 'Class 11-12'],
        tags: ['Biology', 'Photosynthesis'],
        acceptance: 71,
        steps: [
          'Step 1: Photosynthesis produces glucose and oxygen',
          'Step 2: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
        ],
      },
    ],
  },

  // === CODING ===
  {
    id: 'code-loops',
    subject: 'Coding',
    title: 'Loops',
    problems: [
      {
        id: 'loop-sum-1-5',
        title: 'Sum 1..5',
        statement: 'What is the result of summing the integers from 1 to 5 (inclusive)?',
        placeholder: 'Type a number (e.g., 15)',
        answer: '15',
        difficulty: 'Easy',
        tags: ['Loops', 'Basic'],
        acceptance: 92,
        steps: [
          'Step 1: Add numbers in order → 1 + 2 + 3 + 4 + 5',
          'Step 2: Compute → 3 + 3 + 4 + 5 = 6 + 4 + 5 = 10 + 5',
          'Step 3: Result = 15',
        ],
      },
      {
        id: 'loop-sum-1-100',
        title: 'Sum 1..100 (Gauss Formula)',
        statement: 'What is the sum of integers from 1 to 100? Use the formula n(n+1)/2.',
        placeholder: 'Type a number',
        answer: '5050',
        difficulty: 'Easy',
        tags: ['Loops', 'Math Formula'],
        acceptance: 78,
        steps: [
          'Step 1: Use formula: n(n+1)/2 where n = 100',
          'Step 2: 100 × 101 / 2 = 10100 / 2 = 5050',
        ],
      },
      {
        id: 'nested-loop-output',
        title: 'Nested Loop Count',
        statement: 'How many times does the inner statement execute? for(i=0;i<3;i++) for(j=0;j<4;j++) print("*")',
        placeholder: 'Type a number',
        answer: '12',
        difficulty: 'Medium',
        tags: ['Loops', 'Nested'],
        acceptance: 65,
        steps: [
          'Step 1: Outer loop runs 3 times (i = 0, 1, 2)',
          'Step 2: For each outer iteration, inner loop runs 4 times',
          'Step 3: Total = 3 × 4 = 12',
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
        title: 'Zero-based Indexing',
        statement: 'Given the array [10, 20, 30, 40], what value is at index 2?',
        placeholder: 'Type a number (e.g., 30)',
        answer: '30',
        difficulty: 'Easy',
        tags: ['Arrays', 'Basic'],
        acceptance: 94,
        steps: [
          'Step 1: Arrays are zero-based → index 0 is the first element',
          'Step 2: Map indices → 0→10, 1→20, 2→30, 3→40',
          'Step 3: Value at index 2 is 30',
        ],
      },
      {
        id: 'array-max',
        title: 'Find Maximum Element',
        statement: 'What is the maximum element in [3, 7, 2, 9, 4]?',
        placeholder: 'Type a number',
        answer: '9',
        difficulty: 'Easy',
        tags: ['Arrays', 'Basic'],
        acceptance: 91,
        steps: [
          'Step 1: Compare all elements: 3, 7, 2, 9, 4',
          'Step 2: Maximum = 9',
        ],
      },
      {
        id: 'array-reverse',
        title: 'Reverse Array Element',
        statement: 'If you reverse [1, 2, 3, 4, 5], what element is at index 2?',
        placeholder: 'Type a number',
        answer: '3',
        difficulty: 'Easy',
        tags: ['Arrays', 'Manipulation'],
        acceptance: 76,
        steps: [
          'Step 1: Reverse [1, 2, 3, 4, 5] → [5, 4, 3, 2, 1]',
          'Step 2: Index 2 → 3',
        ],
      },
    ],
  },
  {
    id: 'code-strings',
    subject: 'Coding',
    title: 'Strings',
    problems: [
      {
        id: 'string-length',
        title: 'String Length',
        statement: 'What is the length of the string "Hello World"?',
        placeholder: 'Type a number',
        answer: '11',
        difficulty: 'Easy',
        tags: ['Strings', 'Basic'],
        acceptance: 95,
        steps: [
          'Step 1: Count characters including space',
          'Step 2: H-e-l-l-o- -W-o-r-l-d = 11 characters',
        ],
      },
      {
        id: 'palindrome-check',
        title: 'Is It a Palindrome?',
        statement: 'Is "racecar" a palindrome? Answer "yes" or "no".',
        placeholder: 'yes / no',
        answer: 'yes',
        difficulty: 'Easy',
        tags: ['Strings', 'Palindrome'],
        acceptance: 87,
        steps: [
          'Step 1: Read forward: r-a-c-e-c-a-r',
          'Step 2: Read backward: r-a-c-e-c-a-r',
          'Step 3: Same both ways → palindrome',
        ],
      },
      {
        id: 'anagram-check',
        title: 'Anagram Count',
        statement: 'How many characters are in common between "listen" and "silent" (count each occurrence)?',
        placeholder: 'Type a number',
        answer: '6',
        difficulty: 'Medium',
        tags: ['Strings', 'Anagram'],
        acceptance: 58,
        steps: [
          'Step 1: "listen" has letters: l, i, s, t, e, n',
          'Step 2: "silent" has letters: s, i, l, e, n, t',
          'Step 3: All 6 letters match (they are anagrams)',
        ],
      },
    ],
  },
  {
    id: 'code-algorithms',
    subject: 'Coding',
    title: 'Algorithms',
    problems: [
      {
        id: 'binary-search-count',
        title: 'Binary Search Steps',
        statement: 'In a sorted array of 16 elements, what is the maximum number of comparisons binary search needs?',
        placeholder: 'Type a number',
        answer: '5',
        difficulty: 'Medium',
        tags: ['Algorithms', 'Binary Search'],
        acceptance: 52,
        steps: [
          'Step 1: Binary search has O(log₂ n) complexity',
          'Step 2: log₂(16) = 4, but we need ceiling(log₂(n+1))',
          'Step 3: For 16 elements: max comparisons = 5',
        ],
      },
      {
        id: 'bubble-sort-swaps',
        title: 'Bubble Sort Swaps',
        statement: 'How many swaps are needed to sort [4, 3, 2, 1] using bubble sort?',
        placeholder: 'Type a number',
        answer: '6',
        difficulty: 'Hard',
        tags: ['Algorithms', 'Sorting'],
        acceptance: 38,
        steps: [
          'Step 1: Pass 1: [3,2,1,4] - 3 swaps',
          'Step 2: Pass 2: [2,1,3,4] - 2 swaps',
          'Step 3: Pass 3: [1,2,3,4] - 1 swap',
          'Step 4: Total swaps = 3 + 2 + 1 = 6',
        ],
      },
      {
        id: 'time-complexity',
        title: 'Time Complexity',
        statement: 'What is the time complexity of searching in an unsorted array of n elements? Answer as O(?)',
        placeholder: 'O(?)',
        answer: 'O(n)',
        difficulty: 'Easy',
        tags: ['Algorithms', 'Complexity'],
        acceptance: 82,
        steps: [
          'Step 1: Must check each element one by one',
          'Step 2: Worst case: check all n elements',
          'Step 3: Time complexity = O(n)',
        ],
      },
    ],
  },
  {
    id: 'code-recursion',
    subject: 'Coding',
    title: 'Recursion',
    problems: [
      {
        id: 'factorial-5',
        title: 'Factorial Calculation',
        statement: 'What is 5! (5 factorial)?',
        placeholder: 'Type a number',
        answer: '120',
        difficulty: 'Easy',
        tags: ['Recursion', 'Math'],
        acceptance: 88,
        steps: [
          'Step 1: 5! = 5 × 4 × 3 × 2 × 1',
          'Step 2: = 20 × 6 = 120',
        ],
      },
      {
        id: 'fibonacci-7',
        title: 'Fibonacci Number',
        statement: 'What is the 7th Fibonacci number? (Sequence: 1, 1, 2, 3, 5, 8, ...)',
        placeholder: 'Type a number',
        answer: '13',
        difficulty: 'Medium',
        tags: ['Recursion', 'Fibonacci'],
        acceptance: 62,
        steps: [
          'Step 1: F(1)=1, F(2)=1',
          'Step 2: F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13',
        ],
      },
      {
        id: 'recursion-calls',
        title: 'Recursive Call Count',
        statement: 'For naive recursive Fibonacci, how many function calls to compute F(5)?',
        placeholder: 'Type a number',
        answer: '9',
        difficulty: 'Hard',
        tags: ['Recursion', 'Analysis'],
        acceptance: 28,
        steps: [
          'Step 1: F(5) = F(4) + F(3)',
          'Step 2: F(4) = F(3) + F(2), F(3) = F(2) + F(1)',
          'Step 3: Draw call tree: 1 + 2 + 4 + 2 = 9 calls total',
        ],
      },
    ],
  },
]

export function subjectOrder(s: Subject) {
  switch (s) {
    case 'Maths': return 0
    case 'Science': return 1
    case 'Coding': return 2
    default: return 999
  }
}

export function normalizeAnswer(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getTotalProblems(): number {
  return TOPICS.reduce((sum, topic) => sum + topic.problems.length, 0)
}

export function getProblemsByDifficulty(difficulty?: Difficulty): Problem[] {
  const allProblems = TOPICS.flatMap(t => t.problems)
  if (!difficulty) return allProblems
  return allProblems.filter(p => p.difficulty === difficulty)
}
