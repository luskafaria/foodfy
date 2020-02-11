const {
  hash
} = require('bcryptjs')
const {
  randomPassword
} = require('../../lib/utils')
const mailer = require('../../lib/mailer')

const User = require('../models/User')

const email = (userName, userEmail, userPassword) => `
<h2>Olá ${userName}.</h2>
<p>Seu acesso ao Foodfy foi criado com sucesso!</p>
<p>Suas credenciais são:</p>
<p>login: ${userEmail}</p>
<p>senha: ${userPassword}</p>
<p></br></br></p>
<p>Seu acesso está habilitado para criar novas receitas e atribuí-las aos seus devidos Chefs.</p>
<p>Você também pode visualizar todas as receitas cadastradas por você, bem como a lista de todos os Chefs disponíveis.</p>
<p></br></br></p>
<p>Para validar sua conta, faça o primeiro acesso clicando <a href="http://localhost.3000/admin/login"><strong>aqui</strong></a></p> 

`

module.exports = {
  create(req, res) {

    const error = req.session.error
    req.session.error = ''

    user = req.session.user

    return res.render('admin/user/register.njk', {
      error,
      user
    })
  },
  async post(req, res) {
    try {

      // criar uma senha aleatória       

      const password = randomPassword(8)

      // enviar a senha para o e-mail do usuário

      await mailer.sendMail({
        to: req.body.email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Cadastro realizado',
        html: email(req.body.name, req.body.email, password)
      })

      // criar o hash da senha

      const passwordHash = await hash(password, 8)

      // cadastrar o usuário

      const user = {
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
        is_admin: req.body.is_admin || 0
      }


      const userId = await User.create(user)

      // criar uma mensagem de cadastro realizado com sucesso

      return res.redirect(`/admin/users/${userId}`)

    } catch (err) {
      console.error(err)
    }
  },
  async list(req, res) {
    try {
      const error = req.session.error
      req.session.error = ''

      // buscar usuários
      let usersList = await User.findAll();


      function filterOtherUsers(user) {
        return user.id != req.session.userId
      }

      function filterNotAdminUsers(user) {
        return user.is_admin != true
      }

      usersList = usersList.filter(filterOtherUsers)
      usersList = usersList.filter(filterNotAdminUsers)

      // listar todos os usuários cadastrados no sistema
      return res.render('admin/user/users-list.njk', {
        users: usersList,
        error
      })

    } catch (err) {
      console.error(err)
    }
  },
  async show(req, res) {
    try {
      
      const {
        id
      } = req.params

      // buscar usuário
      let user = await User.findOne({
        where: {
          id
        }
      });

      user = {
        ...user,
        firstName: user.name.split(" ")[0]
      }

      return res.render('admin/user/edit.njk', {
        user
      })

    } catch (err) {
      console.error(err)
    }
  },
  async profile(req, res) {
    try {

      const {
        userId: id
      } = req.session

      // buscar usuário
      let user = await User.findOne({
        where: {
          id
        }
      }, 'users');

      firstName = user.name.split(" ")[0]

      user = {
        ...user,
        firstName
      }

      const error = req.session.error
      req.session.error = ""

      return res.render('admin/index.njk', {
        user,
        error
      })

    } catch (err) {
      console.error(err)
    }
  },
  async put(req, res) {
    try {

      const {
        id
      } = req.body

      let user = {
        name: req.body.name,
        email: req.body.email,
        is_admin: req.body.is_admin || 0
      }      

      await User.put(id, user)

      if (req.session.userId == req.body.id)
        return res.render('admin/index.njk', {
          user: {
            ...user,
            firstName: user.name.split(" ")[0],
            id: req.body.id
          },
          success: 'Conta atualizada com sucesso!'
        })

      return res.render('admin/user/edit.njk', {
        user: {
          ...user,
          firstName: user.name.split(" ")[0],
          id
        },
        success: 'Usuário atualizado com sucesso!'
      })

    } catch (err) {
      console.error(err)
    }
  },
  async delete(req, res) {
    try {
      const userId = req.body.id

      await User.delete(userId)

      return res.redirect(`users`)

    } catch (err) {
      console.error(err)
    }
  },
}