const express = require('express');
const nunjucks = require('nunjucks');

const server = express();

const data = require('./data.js');

server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.get('/', (req, res) => {
  return res.render('home', {
    recipes: data
  })
})

server.get('/about', (req, res) => {
  return res.render('about')
})

server.get('/recipesList', (req, res) => {
  return res.render('recipesList', {
    recipes: data
  })
})

server.get('/recipe/:index', (req, res) => {

  const recipes = data;

  const recipeIndex = req.params.index;

  if (!recipes[recipeIndex]) {
    return res.render('notfound')
  };

  return res.render('recipe', {
    recipe: recipes[recipeIndex]
  });
})

server.listen(5555, () => {});