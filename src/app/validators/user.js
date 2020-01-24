const {
  compare
} = require('bcryptjs')

const User = require('../models/User')


async function post(req, res, next) {

  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == "" && req.body[key] != "is_admin") {
      return res.send('Por favor, volte e preencha todos os campos.')
    }
  }

  next()
}

function put(req, res, next) {
  const keys = Object.keys(req.body)


  for (key of keys) {
    if (req.body[key] == "" && req.body[key] != "is_admin") {
      return res.send('Por favor, volte e preencha todos os campos.')
    }
  }

  next()
}

async function passwordMatch(req, res, next) {

  const {
    email,
    password,
    id
  } = req.body

  if (id == req.session.userId) {
    async function checkPassword() {
      const user = await User.findOne({
        where: {
          email
        }
      })

      const passed = await compare(password, user.password)

      if (!passed) return res.render('admin/index', {
        user: req.body,
        error: "Senha incorreta."
      })
    }
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

  post,
  put,
  passwordMatch,
  isItMeIsAdminVerification

}