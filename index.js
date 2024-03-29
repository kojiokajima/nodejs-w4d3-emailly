const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')

require('./models/user.model')
require('./models/survey.modal')
require('./services/passport')
const keys = require('./config/keys')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session()) // tell passport to use cookie to manage authentication

const authRoutes = require('./routes/auth.route')
const surveyRoutes = require('./routes/survey.route')

app.use('/api/auth', authRoutes)
app.use('/api/surveys', surveyRoutes)

mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Server has started running on port ${PORT}`))
}).catch(() => console.err(err))
