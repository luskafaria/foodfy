const db = require('../../app/config/db');
const fs = require('fs')

const Base = require('./Base')

Base.init({
  table: 'recipes'
})

module.exports = {
  ...Base,
 async findAll() {
    const query = `
    SELECT recipes.*, chefs.name AS author
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ORDER BY created_at DESC
    `
    const results = await db.query(query)

    return results.rows
  },
  // async create(values) {
  //   const query = `
  //   INSERT INTO recipes (
  //     user_id,
  //     chef_id,
  //     title,
  //     ingredients,
  //     preparation,
  //     information
  //   ) VALUES ($1, $2, $3, $4, $5, $6)
  //   RETURNING id
  //   `;

  //   const results = await db.query(query, values)

  //   return results.rows[0].id
  // },
  async findOne(id) {
    const results = await db.query(
      `
      SELECT recipes.*, chefs.name AS author
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id=$1
    `, [id]);

    return results.rows[0]
  },
  async files(id) {
    const results = await db.query(
      `
    SELECT files.*, recipe_id, file_id
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_files.recipe_id = $1
    `, [id]
    )
    return results.rows
  },
  async update(values) {
    const query = `
    UPDATE recipes SET 
      title=($1),
      chef_id=($2),
      ingredients=($3),
      preparation=($4),
      information=($5)
    WHERE id = ($6)
    `;

    await db.query(query, values)
    return
  },
  async delete(id) {

    //deletar a receita
    await db.query(`
    DELETE FROM recipes
    WHERE id = $1
    `, [id])

    // pegar todos os arquivos
    const results = await db.query(
      `
    SELECT files.*, recipe_id, file_id
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_files.recipe_id = $1
    `, [id]
    )
    const files = results.rows
    
    // deletar todos os arquivos
    files.map(async file => {
      fs.unlinkSync(`public/${file.path}`)
      await db.query(`
      DELETE FROM files
      WHERE id = $1
      `,[file.id])
    })

    return
  },
  async findBy(filter) {
    const results = await db.query(`
    SELECT recipes.*, chefs.name AS author
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    OR recipes.ingredients ILIKE '%${filter}%'
    ORDER BY updated_at DESC
   `)

   return results.rows
  },
  async findUserFiles(userId) {

    const recipes = await db.query(`
    SELECT recipes.*, users.name AS user
    FROM recipes
    LEFT JOIN users ON (recipes.user_id = users.id)
    WHERE users.id=$1
    `, [userId])

    const results = await recipes.map(async recipes => {
      await db.query(`
      SELEC from 
      `)
    })

    return results.rows
  },
};