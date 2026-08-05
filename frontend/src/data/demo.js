export const student = {
  name: 'Anuki', initials: 'AK', level: 7, points: 2840, streak: 12, rank: 18,
}

export const mastery = [
  { topic: 'Algebra', subject: 'Mathematics', score: 82, delta: 8, color: '#2fa866' },
  { topic: 'Mechanics', subject: 'Science', score: 74, delta: 5, color: '#59a9dd' },
  { topic: 'Geometry', subject: 'Mathematics', score: 61, delta: 3, color: '#f6c453' },
  { topic: 'Electricity', subject: 'Science', score: 42, delta: -2, color: '#f07c5d' },
]

export const activity = [
  { day: 'Mon', score: 64, questions: 8 }, { day: 'Tue', score: 70, questions: 12 },
  { day: 'Wed', score: 66, questions: 6 }, { day: 'Thu', score: 76, questions: 14 },
  { day: 'Fri', score: 72, questions: 10 }, { day: 'Sat', score: 83, questions: 18 },
  { day: 'Sun', score: 88, questions: 11 },
]

export const questions = [
  {
    id: 'q1', subject: 'Mathematics', topic: 'Algebra', subtopic: 'Quadratic equations', difficulty: 'Medium', year: 2023, marks: 3, format: 'Multiple choice',
    text: 'The roots of the equation x² − 7x + 12 = 0 are:', options: ['2 and 6', '3 and 4', '−3 and −4', '1 and 12'], correct: 1,
    explanation: 'Factorise x² − 7x + 12 as (x − 3)(x − 4). Therefore, x = 3 or x = 4.',
  },
  {
    id: 'q2', subject: 'Science', topic: 'Electricity', subtopic: 'Series circuits', difficulty: 'Easy', year: 2022, marks: 2, format: 'Multiple choice',
    text: 'Two identical resistors are connected in series. If the resistance of each is 4 Ω, what is the total resistance?', options: ['2 Ω', '4 Ω', '8 Ω', '16 Ω'], correct: 2,
    explanation: 'In a series circuit, resistances add: 4 Ω + 4 Ω = 8 Ω.',
  },
  {
    id: 'q3', subject: 'Mathematics', topic: 'Geometry', subtopic: 'Circle theorems', difficulty: 'Hard', year: 2021, marks: 4, format: 'Short answer',
    text: 'The angle subtended by an arc at the centre is 116°. Find the angle subtended by the same arc at the circumference.', answer: '58',
    explanation: 'The angle at the centre is twice the angle at the circumference. Therefore 116° ÷ 2 = 58°.',
  },
  {
    id: 'q4', subject: 'Science', topic: 'Mechanics', subtopic: 'Speed and velocity', difficulty: 'Medium', year: 2020, marks: 3, format: 'Short answer',
    text: 'A cyclist travels 600 m in 50 seconds. Calculate the average speed in metres per second.', answer: '12',
    explanation: 'Average speed = distance ÷ time = 600 m ÷ 50 s = 12 m/s.',
  },
]

export const lessons = [
  { id: 1, subject: 'Science', topic: 'Electricity', title: 'Series and parallel circuits', description: 'Build a clear picture of current, voltage and resistance.', duration: '12 min', type: 'Lesson', progress: 35, tone: 'coral' },
  { id: 2, subject: 'Mathematics', topic: 'Algebra', title: 'Factorising quadratics', description: 'Learn the patterns that make quadratic expressions simpler.', duration: '9 min', type: 'Note', progress: 80, tone: 'green' },
  { id: 3, subject: 'Science', topic: 'Mechanics', title: 'Motion graphs made simple', description: 'Read distance–time and velocity–time graphs confidently.', duration: '15 min', type: 'Lesson', progress: 0, tone: 'blue' },
  { id: 4, subject: 'Mathematics', topic: 'Geometry', title: 'Circle theorem essentials', description: 'Five rules, visual examples, and exam-style questions.', duration: '18 min', type: 'Lesson', progress: 0, tone: 'yellow' },
]

export const leaders = [
  { rank: 1, name: 'Nethmi S.', points: 4860, avatar: 'NS', change: '—' },
  { rank: 2, name: 'Dulith R.', points: 4620, avatar: 'DR', change: '↑ 1' },
  { rank: 3, name: 'Sahas K.', points: 4410, avatar: 'SK', change: '↓ 1' },
  { rank: 4, name: 'Minoli P.', points: 4185, avatar: 'MP', change: '↑ 2' },
  { rank: 5, name: 'Kevindu A.', points: 3990, avatar: 'KA', change: '—' },
  { rank: 18, name: 'You', points: 2840, avatar: 'AK', change: '↑ 4', current: true },
]

export const reviewQueue = [
  { id: 1, number: '01 (a)', subject: 'Mathematics', year: 2023, topic: 'Algebra', confidence: 96, status: 'Needs review', text: 'Simplify 3x + 2y − x + 5y.' },
  { id: 2, number: '01 (b)', subject: 'Mathematics', year: 2023, topic: 'Algebra', confidence: 91, status: 'Needs review', text: 'Solve 2x + 7 = 19.' },
  { id: 3, number: '02', subject: 'Mathematics', year: 2023, topic: 'Geometry', confidence: 78, status: 'Flagged', text: 'Using the diagram, calculate the size of angle ABC.' },
  { id: 4, number: '03 (i)', subject: 'Mathematics', year: 2023, topic: 'Measurement', confidence: 88, status: 'Needs review', text: 'Find the area of the shaded region.' },
]
