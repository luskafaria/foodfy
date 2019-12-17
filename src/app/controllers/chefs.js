const Chefs = require('../models/Chefs');
const {
  date
} = require('../../lib/utils');

module.exports = {
  index(req, res) {
    Chefs.listAll(chefs => {
      return res.render("admin/chefs/chefs", {
        chefs,
      });
    });
  },

  create(req, res) {
    res.render('admin/chefs/create');
  },

  post(req, res) {

    const values = [
      req.body.name,
      req.body.avatar_url,
      date(Date.now()).iso,
    ];

    Chefs.create(values, chef => {
      return res.redirect(`chefs/${chef.id}`);
    });
  },

  show(req, res) {
    Chefs.findChef(req.params.id, chef => {
      if (!chef) return res.send('Chef not found!');

      Chefs.listChefRecipes(req.params.id, chef, recipes => {

        return res.render('admin/chefs/show', {
          chef,
          recipes
        });
      });
    });
  },

  edit(req, res) {
    Chefs.findChef(req.params.id, chef => {
      if (!chef) {
        return res.send('Chef not found!');
      }

      res.render(`admin/chefs/edit`, {
        chef,
      });
    });
  },

  put(req, res) {
    const values = [
      req.body.name,
      req.body.avatar_url,
      req.body.id
    ];

    Chefs.update(values, () => {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },

  delete(req, res) {
    Chefs.delete(req.body.id, () => {
      return res.redirect('/admin/chefs')
    })
  }

  /*===CHEFS===*/
}