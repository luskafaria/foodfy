const Receipts = require('../models/Recipes');

exports.index = (req, res) => {
  return res.redirect('/home');
};

exports.home = (req, res) => {
  Receipts.listAll(recipes => {
    return res.render('client/home', {
      recipes,
    });
  });
};

exports.about = (req, res) => {
  return res.render('client/about');
};

exports.recipes = (req, res) => {
  Receipts.listAll(recipes => {
    return res.render('client/recipes', {
      recipes,
    });
  });
};

exports.recipe = (req, res) => {
  const { recipes } = data;

  const recipeIndex = req.params.index;

  if (!recipes[recipeIndex]) {
    return res.render('notfound');
  }

  return res.render('client/recipe', {
    recipe: recipes[recipeIndex],
  });
};
