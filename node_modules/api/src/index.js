import express from 'express'
import cors from 'cors'

import { TOPICS, topicsSummary } from './content.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/topics', (_req, res) => {
  res.json({ topics: topicsSummary() })
})

app.get('/topics/:id', (req, res) => {
  const topic = TOPICS.find((t) => t.id === req.params.id)
  if (!topic) return res.status(404).json({ error: 'topic_not_found' })
  res.json({ topic })
})

app.get('/problems/:id', (req, res) => {
  for (const t of TOPICS) {
    const p = t.problems.find((x) => x.id === req.params.id)
    if (p) return res.json({ topicId: t.id, problem: p })
  }
  return res.status(404).json({ error: 'problem_not_found' })
})

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})


