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


    const query = `INSERT INTO ${this.table}
  (${keys.join(',')}) VALUES (${values.join(',')})
  RETURNING id
`

    const results = await db.query(query)

    return results.rows[0].id
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = File