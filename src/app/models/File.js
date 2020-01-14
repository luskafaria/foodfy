const db = require('../config/db');
const fs = require('fs');


const File = {
  init({
    table
  }) {
    if (!table) throw new Error('Invalid Params')

    this.table = table
  },
  async create(fields) {
    try {
      let keys = [],
        values = []

      Object.keys(fields).map(key => {
        keys.push(key) // name
        values.push(`'${fields[key]}'`) // '2313-asinha.png'
      })

      const query = `
        INSERT INTO ${this.table}
        (${keys.join(',')}) VALUES (${values.join(',')})
        RETURNING id
      `

      const results = await db.query(query)

      return results.rows[0].id
    } catch (err) {
      console.error(err);
    }
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(`${file.path}`)

      await db.query(`
                DELETE FROM recipe_files WHERE file_id = $1
            `, [id])
      await db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])

    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = File