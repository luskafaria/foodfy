const Recipes = require('../models/Recipes');
const {
  date
} = require('../../lib/utils');

module.exports = {
  index(req, res) {
    Recipes.listAll(recipes => {
      return res.render("admin/index", {
        recipes,
      });
    });
  },

  create(req, res) {
    res.render('admin/recipes/create');
  },

  post(req, res) {

    const values = [
      req.body.chef_id,
      req.body.image,
      req.body.title,
      req.body.ingredients.toString(),
      req.body.preparation.toString(),
      req.body.information,
      date(Date.now()).iso,
    ];


    Recipes.create(values, recipe => {
      return res.redirect(`recipes/${recipe.id}`);
    });
  },

  show(req, res) {
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

      return res.render('admin/recipes/show', {
        recipe,
      });
    });
  },

  edit(req, res) {
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

      res.render('admin/recipes/edit', {
        recipe,
      });
    });
  },

  put(req, res) {
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
  },

  delete(req, res) {
    Recipes.delete(req.body.id, () => {
      return res.redirect('/admin/recipes')
    })
  }

  /*===CHEFS===*/
}