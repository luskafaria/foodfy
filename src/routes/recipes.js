const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer')

const RecipeController = require('../app/controllers/RecipeController')



routes.get('/', RecipeController.index); // Mostrar a lista de receitas
routes.get('/create', RecipeController.create); // Mostrar formulário de nova receita
routes.get('/:id', RecipeController.show); // Exibir detalhes de uma receita
routes.get('/:id/edit', RecipeController.edit); // Mostrar formulário de edição de receita

routes.post('/', multer.array("images", 5), RecipeController.post); // Cadastrar nova receita
routes.put('/', multer.array("images", 5), RecipeController.put); // Editar uma receita
routes.delete('/', RecipeController.delete); // Deletar uma receita

module.exports = routes