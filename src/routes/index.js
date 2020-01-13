const express = require('express');
const routes = express.Router();

const recipes = require('./recipes')
const chefs = require('./chefs')

const HomeController = require('../app/controllers/HomeController');

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

/* CLIENT */
routes.get('/', HomeController.index);
routes.get('/home', HomeController.home);
routes.get('/about', HomeController.about);
routes.get('/recipes', HomeController.recipes);
routes.get('/recipes/recipe/:id', HomeController.recipe);


module.exports = routes;
