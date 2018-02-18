import { Router } from 'express'
const passport = require('passport')
const router = Router()

const DB = require('../db/index')
const AccountRep = require('../repositories/accounts')
const AccountLogic = require('../logic/accounts')

// router.post('/login', async function (req, res, next) {
//   let result = await new AccountRep(DB).insertUser(req.body)
//   console.log(result)
//   res.json({success: true, user: req.body})
// })

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      next(err)
    }
    if (!user) {
      return res.json({
        success: false,
        message: info
      })
    }

    req.logIn(user, function (err) {
      if (err) {
        console.log('error while log in', err)
        return next(err)
      }
      return res.json({
        success: true
      })
    })
  })(req, res, next)
})

router.post('/register', async function (req, res, next) {
  let result = await new AccountLogic(new AccountRep(DB)).insertUser(req.body)
  res.json({
    success: result.success,
    isActivated: result.isActivated,
    id: result.id,
    message: result.msg
  })
})

export default router
