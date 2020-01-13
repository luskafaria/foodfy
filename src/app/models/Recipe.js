const db = require('../../app/config/db');

module.exports = {
  listAll() {
    const query = `
    SELECT recipes.*, chefs.name AS chefs_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    `
    return db.query(query);
  },
  async create(values) {
    const query = `
    INSERT INTO recipes (
      chef_id,
      title,
      ingredients,
      preparation,
      information
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `;

    const results = await db.query(query, values)

    return results.rows[0].id
  },
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
  update(values) {
    const query = `
    UPDATE recipes SET
      image=($1),
      title=($2),
      ingredients=($3),
      preparation=($4),
      information=($5)
    WHERE id = $6
    `;

    return db.query(query, values);
  },
  delete(id) {
    const query = `
    DELETE FROM recipes
    WHERE id = $1
    `;

    return db.query(query, [id])
  },
  findBy(filter) {
    return db.query(`
    SELECT recipes.*, chefs.name AS chefs_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    OR recipes.ingredients ILIKE '%${filter}%'
   `);
  }
};