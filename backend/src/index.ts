import { Hono } from 'hono'
import user from './user'
import mentor from './mentor'
import admin from './admin'
import common from './common'

const app = new Hono()

app.route('/api/v1/user' ,user)
app.route('/api/v1/mentor',mentor) 
app.route('/api/v1/admin',admin)
app.route('/api/v1/slot',common)

export default app