const db = require('../config/db');
const fs = require('fs')

const Base = require('./Base')

Base.init({
  table: 'users'
})

module.exports = {
  ...Base,
  async findAll() {
    const results = await db.query(`
      SELECT users.*
      FROM users
      `)

    return results.rows

  },
  // async create(values) {
  //   const query = `
  //   INSERT INTO users (
  //     name,
  //     email,
  //     password,
  //     is_admin
  //   ) VALUES ($1, $2, $3, $4)
  //   RETURNING id
  //   `;

  //   const results = await db.query(query, values)
  //   return results.rows[0].id
  // },
  // async findOne(filters, table) {
  //   try {
  //     const results = await find(filters, table)

  //     return results.rows[0]
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
  async findChefRecipes(chefId) {
    const results = await db.query(`
    SELECT recipes.*, chefs.name AS author
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE chefs.id=$1
    ORDER BY created_at DESC
    `, [chefId])

    return results.rows
  },
  // async update(values) {

  //   const query = `
  //   UPDATE users SET
  //   name=($1),
  //   email=($2)
  //   WHERE id = $3
  //   `;

  //   const results = await db.query(query, values)
  //   return results.rows
  // },
  async delete(id) {
    try {

      //pegar todas as receitas
      const recipesResults = await db.query(
        `
      SELECT recipes.*, recipe_id, file_id
      FROM recipes
      LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
      WHERE recipes.user_id = $1
      `, [id]
      )
      const recipes = recipesResults.rows

      // pegar todos os arquivos
      let files = await Promise.all(recipes.map(async recipe => {

        const results = await db.query(
          `
        SELECT *
        FROM files
        WHERE files.id = $1
        `, [recipe.file_id])

        return results.rows[0]
      }))

      // deletar todos os arquivos
      files.map(async file => {
        fs.unlinkSync(`public/${file.path}`)
      })

      //deletar o usuário
      await db.query(`
      DELETE FROM users
      WHERE id = $1
     `, [id])

      return
    } catch (err) {
      console.log(err)
    }
  }
}