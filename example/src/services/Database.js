const Database = class Db {
  constructor (user, password) {
    this.user = user
    this.password = password
  }

  getConnection() {
    console.log(`Get connection: ${this.user} ${this.password}`)
  }
}

module.exports = ['db', Database, ['%database.user%', '%database.password%'], true, true]
