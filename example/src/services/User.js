const User = class User {

  constructor (db) {
    this.db = db
  }

  getById (id) {
    const myDb = this.db.getConnection()
    // Do something with my DB
    return {user: id, name: `Name of user N°${id}`}
  }
}

module.exports = ['user', User, ['db']]
