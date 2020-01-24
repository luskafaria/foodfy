const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const {
  onlyUsers,
  isLoggedRedirectToProfile,
  isAdmin
} = require('../app/middlewares/session')

// // login / logout
routes.get('/login', isLoggedRedirectToProfile, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', onlyUsers, SessionController.logout)

// // reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/profile', onlyUsers, UserController.profile)
routes.get('/create', onlyUsers, isAdmin, UserController.create)
routes.get('/:id', onlyUsers, UserController.show) //Mostrar os detalhes do usuário

routes.get('/', onlyUsers, UserController.list) //Mostrar a lista de usuários cadastrados
routes.post('/', onlyUsers, isAdmin, UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/', onlyUsers, UserValidator.isItMeIsAdminVerification, UserValidator.passwordMatch, UserValidator.put, UserController.put) // Editar um usuário
routes.delete('/', onlyUsers, isAdmin, UserController.delete) // Deletar um usuário

module.exports = routes