const Recipe = require('../models/Recipe');

module.exports = {
  index(req, res) {
    return res.redirect('/home');
  },
  about(req, res) {
    return res.render('site/about');
  },
  async home(req, res) {
    try {
      let results = await Recipe.listAll()
      const recipes = results.rows

      return res.render('site/home', {
        recipes
      });
    } catch (err) {
      console.error(err)
    }
  },
  async recipes(req, res) {

    try {

      let {
        filter,
      } = req.query;

      if (filter) {
        let results = await Recipe.findBy(filter)
        const searchResults = results.rows;

        return res.render('site/recipes', {
          recipes: searchResults,
          filter
        })

      } else {
        let results = await Recipe.listAll()
        const recipes = results.rows

        return res.render('site/recipes', {
          recipes,
        })
      }
    } catch (err) {
      console.error(err)
    }
  },
  async recipe(req, res) {

    try {

      const recipeId = req.params.id

      let recipe = await Recipe.findOne(recipeId);

      if (!recipe) return res.send('Recipe not found!');

      recipe.ingredients = recipe.ingredients.split(',');
      recipe.ingredients = recipe.ingredients.filter(function (item) {
        return item !== '';
      });
      recipe.preparation = recipe.preparation.split(',');
      recipe.preparation = recipe.preparation.filter(function (item) {
        return item !== '';
      });

      let files = await Recipe.files(recipeId)

      recipe = {
        ...recipe,
        files
      }

      console.log(recipe);

      return res.render('site/recipe', {
        recipe
      })
    } catch (err) {
      console.error(err)
    }
  }
}