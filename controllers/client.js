const data = require('../data.json');

exports.index = (req, res) => {
  return res.redirect('/home')
}

exports.home = (req, res) => {
  return res.render('client/home', {
    recipes: data.recipes
  })
}

exports.about = (req, res) => {
  return res.render('client/about')
}

exports.recipes = (req, res) => {
  return res.render('client/recipes', {
    recipes: data.recipes
  })
}

exports.recipe = (req, res) => {

  const recipes = data.recipes;

  const recipeIndex = req.params.index;

  if (!recipes[recipeIndex]) {
    return res.render('notfound')
  };

  return res.render('client/recipe', {
    recipe: recipes[recipeIndex]
  });
}