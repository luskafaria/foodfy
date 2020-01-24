const db = require('../../app/config/db');

const Base = require('./Base')

Base.init({
  table: 'chefs'
})

module.exports = {
  ...Base,
  async findAll() {
    const results = await db.query(`
      SELECT chefs.*, files.path as file
      FROM chefs
      LEFT JOIN files ON (chefs.file_id = files.id)
      `)

    return results.rows

  },
  // async create(values) {
  //   const query = `
  //   INSERT INTO chefs (
  //     name,
  //     file_id
  //   ) VALUES ($1, $2)
  //   RETURNING id
  //   `;

  //   const results = await db.query(query, values)
  //   return results.rows[0]
  // },
  async findOne(id) {
    const results = await db.query(
      `
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
    `,
      [id]);

    return results.rows[0]
  },
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
  async update(values) {
    const query = `
    UPDATE chefs SET
    name=($1),
    file_id=($3)
    WHERE id = $4
    `;

    return await db.query(query, values)
  },
  async delete(id) {

    await db.query(`
    DELETE FROM chefs
    WHERE id = $1
    `, [id]);

    const results = await db.query(`
    SELECT files.*
    FROM files
    LEFT JOIN chefs ON (files.id = chefs.file_id)
    WHERE chefs.id = $1
    `, [id])

    const files = results.rows

    files.map(async file => {
      fs.unlinkSync(`public/${file.path}`)
      await db.query(`
      DELETE FROM files
      WHERE id = $1
      `, [file.id])

    })
  },
  async files(id) {
    const results = await db.query(
      `
    SELECT files.*
    FROM files
    LEFT JOIN chefs ON (files.id = chefs.file_id)
    WHERE chefs.id = $1
    `, [id]
    )
    return results.rows
  },
};