const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')


routes.get('/', ChefController.index); // Mostrar a lista de chefs
routes.get('/create', ChefController.create); // Mostrar formulário de novo chef
routes.get('/:id', ChefController.show); // Exibir detalhes de um chef
routes.get('/:id/edit', ChefController.edit); // Mostrar formulário de edição de chefs

routes.post('/', multer.array("images", 1), ChefController.post); // Cadastrar nov chef
routes.put('/', multer.array("images", 1), ChefController.put); // Editar chef
routes.delete('/', ChefController.delete); // Deletar chef

module.exports = routes