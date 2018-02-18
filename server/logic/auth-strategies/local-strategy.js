const bcrypt = require('bcryptjs')

module.exports = (Strategy, accountRep) => {
  return new Strategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  }, async function (req, username, password, done) {
    try {
      let user
      let userByName = await accountRep.userByName(username)
      if (userByName) {
        user = userByName
      } else {
        let userByEmail = await accountRep.userByEmail(username)
        if (userByEmail) {
          user = userByEmail
        }
      }
      // let user = await accountRep.userByName(username);
      if (!user) {
        return done(null, false, 'Incorrect username or email')
      } else if (!user.is_activated) {
        return done(null, false, 'not activated')
      } else {
        bcrypt.compare(req.body.password, user.hash, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else return done(null, false, 'Incorrect password')
        })
      }
    } catch (err) {
      done(err)
    }
  })
}
