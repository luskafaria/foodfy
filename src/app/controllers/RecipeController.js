const Recipe = require('../models/Recipe');
const File = require('../models/File');

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

    return res.redirect(`/admin/recipes/${recipeId}/edit`);
  },
  async show(req, res) {
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

      return res.render(`admin/recipes/show`, {
        recipe
      })
    } catch (err) {
      console.error(err)
    }
  },
  async edit(req, res) {

    let recipe = await Recipe.findOne(req.params.id)

    if (!recipe) return res.send('Recipe not found!');

    recipe.ingredients = recipe.ingredients.split(',');
    recipe.ingredients = recipe.ingredients.filter(function (item) {
      return item != '';
    });
    recipe.preparation = recipe.preparation.split(',');
    recipe.preparation = recipe.preparation.filter(function (item) {
      return item != '';
    });

    let files = await Recipe.files(req.params.id)

    recipe = {
      ...recipe,
      files
    }

    res.render('admin/recipes/edit', {
      recipe,
    });
  },
  async put(req, res) {
    try {
      // verificar se todos os campos estão preenchidos
      const keys = Object.keys(req.body)

      for (key of keys) {
        if (req.body[key] == "" && key != "removed_files" && key != "author") {
          return res.send('Please, fill all fields!')
        }
      }

      // envio dos novos arquivos
      if (req.files.length != 0) {
        File.init({
          table: 'files'
        })
        const newFilesPromise = req.files.map(file => File.create({
          name: file.filename,
          path: `/images/${file.filename}`
        }))

        const filesIds = await Promise.all(newFilesPromise)

        File.init({
          table: 'recipe_files'
        })
        const relationPromise = filesIds.map(id => File.create({
          recipe_id: req.body.id,
          file_id: id
        }))

        await Promise.all(relationPromise)
      }

      //remover fotos
      if (req.body.removed_files) {
        // 1,2,3,
        const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1) // [1,2,3]

        const removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
      }

      const values = [
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
}