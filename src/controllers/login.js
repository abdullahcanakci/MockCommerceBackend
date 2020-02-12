const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const reqEmail = body.email
  const reqPass = body.password

  if (reqEmail && reqPass) {
    const userToLogin = await User.findOne({ email: reqEmail })
    const isSuccessful =
      userToLogin === null
        ? false
        : await bcrypt.compare(reqPass, userToLogin.passwordHash)

    if (isSuccessful) {
      const token = jwt.sign(
        { email: userToLogin.email, id: userToLogin._id },
        process.env.TOKEN_SECRET
      )

      response
        .status(200)
        .send({ token })
        .end()
    } else {
      response
        .status(401)
        .send({ error: 'wrong credentials' })
        .end()
    }
  } else {
    response.send({ error: 'insufficient data to login' })
  }
})

module.exports = loginRouter
