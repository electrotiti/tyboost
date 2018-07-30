const tyboost = require('../../../../../lib/index')
const express = require('express')
const config = require('../../config/config1.json')
const service4 = require('../../services/service4')

let app = tyboost(express(), config)
let server

app.register(tyboost.routes(__dirname + '/../../routes/route7.js'))
app.register(tyboost.services([{
  name: 'service5',
  definition: service4,
  dependencies: ['value1']
}, {
  name: 'service6',
  definition: service4,
  dependencies: ['value2', '@service5']
}]))

async function boot () {
  await app.boot()
  server = app.listen(8088, () => {
  })
}

function close () {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
