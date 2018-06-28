const tyboost = require('../../../../../lib/index')
const express = require('express')
const config = require('../../config/config1.json')

let app = tyboost(express(), config)
let server

app.register(tyboost.routes(__dirname + '/../../routes/route5.js'))
app.register(tyboost.services(__dirname + '/../../services'))

async function boot () {
  await app.boot()
  server = app.listen(8086, () => {
  })
}

function close () {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
