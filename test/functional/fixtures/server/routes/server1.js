const tyboost = require('../../../../../lib/index')
const express = require('express')

let app = tyboost(express())
let server

app.register(() => {
  let router = express.Router()
  router.get('/test1', (req, res) => {
    res.json({data: 'test1'})
  })
  app.use(router)
})

async function boot () {
  await app.boot()
  server = app.listen(8081, () => {})
}

function close() {
  server.close()
}

module.exports.boot = boot
module.exports.close = close
