import express from 'express'
import { Nuxt, Builder } from 'nuxt'

import api from './api'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)
const bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(cookieParser())

const DB = require('./db')
const PgSession = require('connect-pg-simple')
const session = require('express-session')
const _config = require('../config')

const sessionStore = new (PgSession(session))({
  pool: DB._pool,
  tableName: 'session'
})

const AccountRep = require('./repositories/accounts')
const passport = require('passport')
app.use(passport.initialize())
app.use(session({
  store: sessionStore,
  secret: _config.get('sessionSecret'),
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 30 * 24 * 60 * 60 * 1000} // 30 days
}))

app.use(function (req, res, next) {
  req.db = DB
  next()
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  let rep = new AccountRep(DB)
  let user = await rep.userById(id)
  done(null, user)
})

const LocalStrategy = require('./logic/auth-strategies/local-strategy')
passport.use(LocalStrategy(require('passport-local').Strategy, new AccountRep(DB)))

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
