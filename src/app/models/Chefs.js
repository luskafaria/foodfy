const db = require('../../app/config/db');

module.exports = {
  listAll() {
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC
      `);
  },
  create(values) {
    const query = `
    INSERT INTO chefs (
      name,
      avatar_url,
      created_at
    ) VALUES ($1, $2, $3)
    RETURNING id
    `;

    return db.query(query, values);
  },
  findChef(id) {
    return db.query(
      `
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id      
    `,
      [id]);
  },
  listChefRecipes(chefId) {
    return db.query(`
    SELECT recipes.*
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE chefs.id=$1
    `, [chefId])
  },
  update(values) {
    const query = `
    UPDATE chefs SET
      name=($1),
      avatar_url=($2)
    WHERE id = $3
    `;

    return db.query(query, values)
  },
  delete(id) {
    const query = `
    DELETE FROM chefs
    WHERE id = $1
    `
    
    return db.query(query, [id]);
  }
};