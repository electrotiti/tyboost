const tyboost = require('../../../../../lib/index')
const express = require('express')
const config = require('../../config/config1.json')
const service4 = require('../../services/service4')

let app = tyboost(express(), config)
let server

app.register(tyboost.routes(__dirname + '/../../routes/route6.js'))
app.register(tyboost.services({
  name : 'service4',
  definition : service4,
  dependencies: ['value1']
}))

async function boot () {
  await app.boot()
  server = app.listen(8087, () => {
  })
}

function close () {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
