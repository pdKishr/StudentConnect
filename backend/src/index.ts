import { Hono } from 'hono'
import student from './student'
import mentor from './mentor'

const app = new Hono()

app.route('/api/v1/student',student)
app.route('/api/v1/mentor',mentor)

export default app