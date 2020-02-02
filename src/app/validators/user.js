const {
  compare
} = require('bcryptjs')

const User = require('../models/User')

async function passwordMatch(req, res, next) {

  const {
    email,
    password,
  } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  const passed = await compare(password, user.password)

  if (!passed) {
    req.session.error = 'Senha incorreta!'
    return res.redirect('/admin/users/profile')
  }
  
  next()

}

async function isItMeIsAdminVerification(req, res, next) {

  function itsNotUser() {
    
    req.session.error = 'Desculpe! Apenas administradores podem realizar essa ação.'
    return res.redirect('/admin/users/profile')
  }

  (req.body.id == req.session.userId) ? next():
    req.session.isAdmin == true ? next() :
    itsNotUser()

}

module.exports = {
  passwordMatch,
  isItMeIsAdminVerification
}