const Recipe = require('../models/Recipe');
const File = require('../models/File');

async function createRecipesList(req, res) {
  let recipes = await Recipe.findAll()

  async function getImage(productId) {
    let results = await Recipe.files(productId)

    return results[0]
  }

  const recipesPromise = recipes.map(async recipe => {

    recipe.file = await getImage(recipe.id)

    return recipe
  })

  let recipesList = await Promise.all(recipesPromise)

  return recipesList
}

module.exports = {

  async listAll(req, res) {

    let recipesList = await createRecipesList(req, res)

    return res.render("admin/recipes/list.njk", {
      recipes: recipesList,
    })
  },
  async listMyRecipes(req, res) {

    let recipesList = await createRecipesList(req, res)

    function filterMyRecipes(recipe) {

      return recipe.user_id == req.session.userId
    }

    recipesList = recipesList.filter(filterMyRecipes)

    return res.render("admin/recipes/list.njk", {
      recipes: recipesList,
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

    let recipe = {
      user_id: req.body.user_id || 1,
      chef_id: req.body.chef_id || 1,
      title: req.body.title,
      ingredients: req.body.ingredients.toString(),
      preparation: req.body.preparation.toString(),
      information: req.body.information
    }

    const recipeId = await Recipe.create(recipe);

    File.init({
      table: 'recipe_files'
    })

    const relationPromise = filesIds.map(id => File.create({
      recipe_id: recipeId,
      file_id: id
    }))

    await Promise.all(relationPromise)

    return res.redirect(`/admin/recipes/${recipeId}/edit`);
  },
  async show(req, res) {
    try {

      const error = req.session.error
      req.session.error = ""

      const success = req.session.success
      req.session.success = ""

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
        recipe,
        error,
        success
      })
    } catch (err) {
      console.error(err)
    }
  },
  async edit(req, res) {

    try {
      let recipe = await Recipe.findOne(req.params.id)

      if (!recipe) return res.send('Recipe not found!');

      recipe.ingredients = recipe.ingredients.split(',')
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

      console.log(recipe.ingredients.length);
      

      res.render('admin/recipes/edit', {
        recipe,
      });
    } catch (err) {
      console.log(err);

    }
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

      req.session.success = 'Receita alterada com sucesso!'

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