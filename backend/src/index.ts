import { Hono } from 'hono'
import user from './user'
import mentor from './mentor'

const app = new Hono()

app.route('/api/v1/user' ,user)
app.route('/api/v1/mentor',mentor)

export default app