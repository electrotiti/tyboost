const tyboost = require('../../../../../lib/index')
const express = require('express')

let app = tyboost(express())
let server

app.register(tyboost.routes(__dirname + '/../../routes/route4.js'))
app.register(tyboost.services(__dirname + '/../../services/service1.js'))

async function boot () {
  await app.boot()
  server = app.listen(8085, () => {})
}

function close() {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
