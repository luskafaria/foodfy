const express = require('express');

const routes = express.Router();
const site = require('./app/controllers/site');
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');

/* CLIENT */
routes.get('/', site.index);
routes.get('/home', site.home);
routes.get('/about', site.about);
routes.get('/recipes', site.recipes);
routes.get('/recipes/recipe/:id', site.recipe);

/* ADMIN */

routes.get('/admin/recipes', recipes.index); // Mostrar a lista de receitas
routes.get('/admin/recipes/create', recipes.create); // Mostrar formulário de nova receita
routes.get('/admin/recipes/:id', recipes.show); // Exibir detalhes de uma receita
routes.get('/admin/recipes/:id/edit', recipes.edit); // Mostrar formulário de edição de receita

routes.post('/admin/recipes', recipes.post); // Cadastrar nova receita
routes.put('/admin/recipes', recipes.put); // Editar uma receita
routes.delete('/admin/recipes', recipes.delete); // Deletar uma receita

routes.get('/admin/chefs', chefs.index); // Mostrar a lista de chefs
routes.get('/admin/chefs/create', chefs.create); // Mostrar formulário de novo chef
routes.get('/admin/chefs/:id', chefs.show); // Exibir detalhes de um chef
routes.get('/admin/chefs/:id/edit', chefs.edit); // Mostrar formulário de edição de chefs

routes.post('/admin/chefs', chefs.post); // Cadastrar nov chef
routes.put('/admin/chefs', chefs.put); // Editar chef
routes.delete('/admin/chefs', chefs.delete); // Deletar chef

module.exports = routes;
