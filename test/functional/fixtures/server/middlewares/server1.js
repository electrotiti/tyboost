const tyboost = require('../../../../../lib/index')
const express = require('express')

let app = tyboost(express())
let server

app.register(tyboost.middlewares(__dirname + '/../../middlewares/pre/middleware1.js'))
app.register(tyboost.routes(__dirname + '/../../routes/route3.js'))

async function boot () {
  await app.boot()
  server = app.listen(8084, () => {})
}

function close() {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
