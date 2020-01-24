const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

const { isAdmin } = require('../app/middlewares/session')



routes.get('/', ChefController.index); // Mostrar a lista de chefs
routes.get('/create', isAdmin, ChefController.create); // Mostrar formulário de novo chef
routes.get('/:id', ChefController.show); // Exibir detalhes de um chef
routes.get('/:id/edit', isAdmin, ChefController.edit); // Mostrar formulário de edição de chefs

routes.post('/', isAdmin, multer.array("images", 1), ChefController.post); // Cadastrar nov chef
routes.put('/',  isAdmin, multer.array("images", 1), ChefController.put); // Editar chef
routes.delete('/', isAdmin, ChefController.delete); // Deletar chef

module.exports = routes