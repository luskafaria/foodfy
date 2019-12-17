const db = require('../../app/config/db');

module.exports = {
  listAll(callback) {
    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC
      `,
      (err, results) => {
        if (err) throw `Database error: ${err}`;

        callback(results.rows);
      }
    );
  },
  create(values, callback) {
    const query = `
    INSERT INTO chefs (
      name,
      avatar_url,
      created_at
    ) VALUES ($1, $2, $3)
    RETURNING id
    `;

    db.query(query, values, (err, results) => {
      if (err) throw `Database error: ${err}`;

      callback(results.rows[0]);
    });
  },
  findChef(id, callback) {
    db.query(
      `
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id      
    `,
      [id],
      (err, results) => {
        if (err) throw `Database error: ${err}`;

        callback(results.rows[0]);
      }
    );
  },
  listChefRecipes(chefId, chefData, callback) {
    db.query(`
    SELECT recipes.*
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE chefs.id=$1
    `, [chefId],
    (err, results) => {
      if(err) throw `Database error: ${err}`;

      callback(results.rows)
    })
  },
  update(values, callback) {
    const query = `
    UPDATE chefs SET
      name=($1),
      avatar_url=($2)
    WHERE id = $3
    `;

    db.query(query, values, (err, results) => {
      if (err) throw `Database error:${err}`;

      callback();
    });
  },
  delete(id, callback) {
    const query = `
    DELETE FROM chefs
    WHERE id = $1
    `;

    db.query(query, [id], (err, results) => {
      if (err) throw `Database error:${err}`;

      callback();
    });
  }
};