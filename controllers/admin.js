const data = require('../data.json');
const fs = require('fs');

exports.index = (req, res) => {
  return res.render('admin/index', {
    recipes: data.recipes
  })
}

exports.create = (req, res) => {

  res.render('admin/create')
}

exports.post = (req, res) => {

  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "" && req.body[key] != req.body.image) {
      return res.send('Please, fill all fields.')
    }
  }

  let {
    image,
    title,
    author,
    ingredients,
    preparation,
    information
  } = req.body;

  const created_at = Date.now();
  const id = Number(data.recipes.length + 1);

  data.recipes.push({
    id,
    image,
    title,
    author,
    ingredients,
    preparation,
    information,
    created_at
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error')

    return res.redirect("/admin/recipes");
  })
}

exports.show = (req, res) => {
  const {
    id
  } = req.params;

  const foundRecipe = data.recipes.find((recipe) => {
    return id == recipe.id;
  })

  if (!foundRecipe) return res.send('Instructor not found!');

  const recipe = {
    ...foundRecipe
  }

  return res.render('admin/show', {
    recipe
  })
}

exports.edit = (req, res) => {
  const {
    id
  } = req.params;

  const foundRecipe = data.recipes.find((recipe) => {
    return id == recipe.id;
  })

  if (!foundRecipe) return res.send('Instructor not found!');

  const recipe = {
    ...foundRecipe
  }



  res.render('admin/edit', {
    recipe
  })
}

exports.put = (req, res) => {
  const {
    id
  } = req.body;

  let index = 0;

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if (id == recipe.id) {
      index = foundIndex
      return true

    }
  })

  if (!foundRecipe) return res.send('Instructor not found!');

  const ingredients = req.body.ingredients.filter(function(el) {
    return el != '';
  })

  const preparation = req.body.preparation.filter(function(el) {
    return el != '';
  })

  const recipe = {
    ...foundRecipe,
    ...req.body,
    ingredients,
    preparation
  }

  data.recipes[index] = recipe;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error');
  })

  return res.redirect(`/admin/recipes/${id}`)
}

exports.delete = (req, res) => {
  const {
    id
  } = req.body

  const filteredRecipes = data.recipes.filter((recipe) => {
    return recipe.id != id;
  })

  data.recipes = filteredRecipes;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error');

    return res.redirect('/admin/recipes')
  })
}