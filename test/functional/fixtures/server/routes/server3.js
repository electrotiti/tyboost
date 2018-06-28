const tyboost = require('../../../../../lib/index')
const express = require('express')
const bodyParser = require('body-parser')

let app = tyboost(express())
let server

app.register(()=> {
  app.use(bodyParser.json())
})
app.register(tyboost.routes(__dirname + '/../../routes'))

async function boot () {
  await app.boot()
  server = app.listen(8083, () => {})
}

function close() {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
