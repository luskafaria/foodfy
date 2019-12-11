const Recipes = require('../models/Recipes');
const {
  date
} = require('../../lib/utils');

exports.index = (req, res) => {
  Recipes.listAll(recipes => {
    return res.render("admin/index", {
      recipes,
    });
  });
};

exports.create = (req, res) => {
  res.render('admin/create');
};

exports.post = (req, res) => {

  const values = [
    req.body.chef_id,
    req.body.image,
    req.body.title,
    req.body.ingredients.toString(),
    req.body.preparation.toString(),
    req.body.information,
    date(Date.now()).iso,
  ];

  console.log(values);

  Recipes.create(values, recipe => {
    return res.redirect(`recipes/${recipe.id}`);
  });
};

exports.show = (req, res) => {
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

    return res.render('admin/show', {
      recipe,
    });
  });
};

exports.edit = (req, res) => {
  Recipes.findRecipe(req.params.id, recipe => {
    if (!recipe) {
      return res.send('Recipe not found!');
    }

    recipe.ingredients = recipe.ingredients.split(',');
    recipe.ingredients = recipe.ingredients.filter(function (item) {
      return item != '';
    });
    recipe.preparation = recipe.preparation.split(',');
    recipe.preparation = recipe.preparation.filter(function (item) {
      return item != '';
    });

    res.render('admin/edit', {
      recipe,
    });
  });
};

exports.put = (req, res) => {
  const values = [
    req.body.image,
    req.body.title,
    req.body.ingredients.toString(),
    req.body.preparation.toString(),
    req.body.information,
    req.body.id,
  ];

  Recipes.update(values, () => {
    return res.redirect(`/admin/recipes/${req.body.id}`);
  });
};

exports.delete = (req, res) => {
  Recipes.delete(req.body.id, () => {
    return res.redirect('admin/recipes')
  })
};