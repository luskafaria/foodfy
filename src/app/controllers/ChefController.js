const Chefs = require('../models/Chefs');
const {
  date
} = require('../../lib/utils');

module.exports = {
  async index(req, res) {
    try {
      let results = await Chefs.listAll()
      const chefs = results.rows

      return res.render("admin/chefs/chefs", {
        chefs
      });
    } catch (err) {
      console.error(err);

    }
  },
  create(req, res) {
    res.render('admin/chefs/create');
  },
  async post(req, res) {
    try {

      const values = [
        req.body.name,
        req.body.avatar_url,
        date(Date.now()).iso,
      ];

      const results = await Chefs.create(values)
      const chef = results.rows[0]

      return res.redirect(`chefs/${chef.id}`);


    } catch (err) {
      console.error(err);
    }

  },
  async show(req, res) {
    try {
      let results = {}

      results.chef = await Chefs.findChef(req.params.id)
      const chef = results.chef.rows[0]

      if (!chef) return res.send('Chef not found!');

      results.recipes = await Chefs.listChefRecipes(req.params.id)
      const recipes = results.recipes.rows

      console.log(results.chef);


      return res.render('admin/chefs/show', {
        chef,
        recipes
      })
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      const results = await Chefs.findChef(req.params.id)
      const chef = results.rows[0]

      if (!chef) {
        return res.send('Chef not found!');
      }

      res.render(`admin/chefs/edit`, {
        chef,
      })
    } catch (err) {
      console.error(err)
    }
  },
  async put(req, res) {
    try {
      const values = [
        req.body.name,
        req.body.avatar_url,
        req.body.id
      ]
  
      await Chefs.update(values)
  
      return res.redirect(`/admin/chefs/${req.body.id}`)
    } catch (err) {
      console.error(err);
      
    }
  },
  async delete(req, res) {
    try {
      await Chefs.delete(req.body.id)

    return res.redirect('/admin/chefs')
    } catch (err) {
      console.error(err)
    }
  }

  /*===CHEFS===*/
}