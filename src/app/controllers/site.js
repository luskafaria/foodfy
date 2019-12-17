const Recipes = require('../models/Recipes');

exports.index = (req, res) => {
  return res.redirect('/home');
};

exports.home = (req, res) => {
  Recipes.listAll(recipes => {
    return res.render('site/home', {
      recipes,
    });
  });
};

exports.about = (req, res) => {
  return res.render('site/about');
};

exports.recipes = (req, res) => {

  let {
    filter,
  } = req.query;

  if (filter) {
    Recipes.findBy(filter, searchResults => {
      return res.render('site/recipes', {
        recipes: searchResults,
        filter
      })
    })
  } else {
    Recipes.listAll(recipes => {
      return res.render('site/recipes', {
        recipes,
      });
    });
  }

};

exports.recipe = (req, res) => {

  Recipes.findRecipe(req.params.id, recipe => {
    if (!recipe) return res.send('Recipe not found!');

    recipe.ingredients = recipe.ingredients.split(',');
    recipe.ingredients = recipe.ingredients.filter(function (item) {
      return item !== '';
    });
    recipe.preparation = recipe.preparation.split(',');
    recipe.preparation = recipe.preparation.filter(function (item) {
      return item !== '';
    });

    return res.render('site/recipe', {
      recipe,
    });
  });
};