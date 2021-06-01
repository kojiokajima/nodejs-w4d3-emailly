const express = require('express')
const mongoose = require('mongoose')

const Survey = mongoose.model('Survey')
const requireLogin = require('../middlewares/requireLogin')
const mailer = require('../services/mailer')
const surveyTemplate = require('../services/emailTemplate/surveyTemplate')
// const { route } = require('./auth.route')

const router = express.Router()

router.get('/', requireLogin, async(req, res, next) => {
  const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false })
  res.send(surveys)
})

router.get('/:surveyId/:choices/', (req, res) => {
  // do some other logic here...

  res.send({ msg: "Thank you for participating..." })
}) //domainname.com/api/surveys/a12vfdfvs/yes

router.post('/', requireLogin, async(req, res, next) => {
  const { title, subject, body, recipients } = req.body
  const survey = new Survey({
    title,
    subject,
    body,
    recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
    _user: req.user.id,
    dateSent: Date.now()
  })

  try{
    await mailer(survey, surveyTemplate(survey))
    await survey.save()

    const user = req.user.save()
    res.send(user)
  }catch(err){
    res.status(422).send(err)
  }
})

module.exports = router