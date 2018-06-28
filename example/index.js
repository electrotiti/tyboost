const tyboost = require('tyboost')
const express = require('express')
const config = require('./config/config.json')

let app = tyboost(express(), config)

// These middleware will be call before the controllers
// It's the good place to have authentication middlewares
app.register(tyboost.middlewares(__dirname + '/src/middlewares/pre'))

// Register the API routes of Express JS
app.register(tyboost.routes(__dirname + '/src/controllers'))

// Register service with an IOC into a container and will be available in "context" variable of express
app.register(tyboost.services(__dirname + '/src/services'))

// These middleware will be call after all
// It's the good place to have handler error
app.register(tyboost.middlewares(__dirname + '/src/middlewares/post'))

async function boot () {
  await app.boot()
  app.listen(8080, () => {
    console.log('Listen on port 8080')
  })
}

boot()
