import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import * as sqlite3 from 'sqlite3'
import sqliteSessionStore from 'express-session-sqlite'
import { createInMemoryDB } from './databaseService.mjs'
import { postLogin, authenticated, getLogout } from './loginService.mjs'
import { getUsage, postPayment, getBilling } from './statsService.mjs'

const app = express()
const port = 3000

app.set('view engine', 'jade')
app.use(express.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser())

// use express sessions and store in db
app.use(session({ secret: "super secret string" }));
const SqliteStore = sqliteSessionStore.default(session)
app.use(session({
    store: new SqliteStore({
        driver: sqlite3.Database,
        path: ':memory:',
        ttl: 604800000, // 1 week
    }),
}));

// set up csrf middleware
const csrfProtection = csurf({ cookie: true })

// Create in memory database
createInMemoryDB()

// Start listening...
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

// Routes
app.get("/dashboard", csrfProtection, authenticated, (req, res) => {
  res.render("dashboard", { name: req.username, csrfToken: req.csrfToken() })
})

app.get("/usage", csrfProtection, authenticated, getUsage)

app.get("/billing", csrfProtection, authenticated, getBilling)

app.post("/payment", csrfProtection, authenticated, postPayment)

app.get("/login", csrfProtection, (req, res) => {     
  res.render('login', { csrfToken: req.csrfToken() })
})

app.get("/", csrfProtection, authenticated)

app.post('/login', csrfProtection, postLogin)

app.get("/logout", csrfProtection, getLogout)

// All other routes
app.get("*", (req, res) => {
  res.status(404)
  res.send('Page not found')
})
