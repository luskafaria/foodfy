const Recipe = require('../models/Recipe');
const File = require('../models/File');
const {
  date
} = require('../../lib/utils');


module.exports = {
  async index(req, res) {
    let results = await Recipe.listAll();
    const recipes = results.rows

    return res.render("admin/index", {
      recipes,
    })
  },
  create(req, res) {
    res.render('admin/recipes/create');
  },
  async post(req, res) {

    if (req.files.length == 0) {
      return res.send('Please, send at least one image')
    }

    File.init({
      table: 'files'
    })

    const filesPromise = req.files.map(file => File.create({
      name: file.filename,
      path: `/images/${file.filename}`
    }))

    const filesIds = await Promise.all(filesPromise)

    values = [
      req.body.chef_id = 1,
      req.body.title,
      req.body.ingredients.toString(),
      req.body.preparation.toString(),
      req.body.information
    ];

    const recipeId = await Recipe.create(values);

    File.init({
      table: 'recipe_files'
    })

    console.log(recipeId);
    console.log(filesIds);

    const relationPromise = filesIds.map(id => File.create({
      recipe_id: recipeId,
      file_id: id
    }))

    await Promise.all(relationPromise)

    return res.redirect(`admin/${recipeId}/edit`);
  },
  async show(req, res) {
    try {     
      const recipeId = req.params.id

      let recipe = await Recipe.findOne(recipeId)

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

      console.log(files);
      

      return res.render('admin/recipes/show', {
        recipe,
      });
    } catch (err) {
      console.error(err)
    }
  },
  async edit(req, res) {
    const results = await Recipe.findRecipe(req.params.id)
    const recipe = results.rows[0]

    if (!recipe) return res.send('Recipe not found!');

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
  },
  async put(req, res) {
    try {
      const values = [
        req.body.image,
        req.body.title,
        req.body.ingredients.toString(),
        req.body.preparation.toString(),
        req.body.information,
        req.body.id,
      ];

      await Recipe.update(values)

      return res.redirect(`/admin/recipes/${req.body.id}`)
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      await Recipe.delete(req.body.id)

      return res.redirect('/admin/recipes')
    } catch (err) {
      console.error(err);

    }
  }

  /*===CHEFS===*/
}