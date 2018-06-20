# Tyboost
Initialization layer and tools for Node.js applications.

Tyboost allows initialization steps to be registered for an application. 
All these steps will be executed sequentially during startup, after which the application will be ready to run.

Tyboost also provides several helpers to load classic components such as routes handlers, 
services with IOC, middlewares, etc.

## Install
    $ npm install tyboost
    or
    $ yarn add tyboost

## Usage

Tyboost should be applicable to any Node.js application. 
Currently it has been tested with ExpressJs which is one of the most common Framework


    const express = require('express')
    const tyboost = require('tyboost')

    const app = tyboost(express())

This will create an Express Js application with two additional functions: ```app.register()``` and ```app.boot()```
The first one is use to register a step, (manually or with helpers) and the second one is use to boot the application
by executed all registered steps. 


## Register step
When starting a Node JS application, some steps must be executed sequentially, 
such as loading routes, creating services, connecting to databases or registering middleware.

### With helpers
Tyboost provides several helpers, check the helpers section for more informations

    app.register(tyboost.services('/path/to/the/services'))
    app.register(tyboost.routes('/path/to/the/routes'))
    app.register(tyboost.middlewares('/path/to/the/middleware'))

### Manually

You can register manually a function or an array of function

    app.register(() => {
        // Do something here
    })
    
    app.register([
        () => {
            // Do something here
        },
        () => {
            // Do something here
        }
    ])

#### Order of execution 

Each step will be executed following the order of registration, if the step is synchronous 
or if the step return a promise

    // First to be register
    app.register(() => {
        // This step will be the first to be execute
    })
    
    // Second to be register
    app.register(() => {
        setTimeout(()=> {
            // This code will be the third to be execute
        }, 1000)
    })
    
    // Third to be register
    app.register(() => {
        return new Promise(resolve => {
            // This code will be the second to be execute
            resolve()
        })
    })

## Boot application

Call ```app.boot``` to boot your application, this will return a promise. 
Registered steps will be executed sequentially, and the promise will be resolve when all steps are complete.

Example with the default promise syntax:

    app.boot()
        .then(()=>{
            app.listen(8080, () => {
                console.log('Listen on port 8080')
            })
        })
        .catch((err)=>{
            console.log(err)
        })

Example with await/async syntax:

    async function start () {
      try {
        await app.boot()
        app.listen(8080, () => {
            console.log('Listen on port 8080')
          })
      } catch(err) {
        console.log(err)
      }
    }
    
    start()
    
## ExpressJS Helpers
Currently the helpers has been design only for Express Js

### Routes helper
The routes helpers allows you to load multiple routes from a folder (including the sub folder) at one time.
Each file have to return a Express JS router.

You can use this helper with the function ```tyboost.routes()```

Example of a directory structure

    .
    +-- index.js
    +-- src
    |   +-- handler 
    |   |   +-- account
    |   |   |   +-- User.js
    |   |   +-- Login.js     

File User.js:
    
    let router = express.Router()
    router.get('/user', (req, res)=>{
        res.json({name:'My User Name'})
    })
    
    module.exports = router

File Login.js:
    
    let router = express.Router()
    router.post('/login', (req, res)=>{
        // Authentification...
        res.json({ logged:true })
    })
    
    module.exports = router

To load the routes call the helper like this:

    app.register(tyboost.routes(__dirname + 'src/handler'))
    
You can add prefix ```/api``` a the beginning of your route like this:

    app.register(tyboost.routes(__dirname + 'src/handler'), '/api')

You can also call this helper with only with one file
    
    app.register(tyboost.routes(__dirname + 'src/handler/account/User.js'))
    
This helper is to help you to load quickly your routes but you can do this manually like this:

    let router = express.Router()
    app.register(() => {
        router.get('/user', (req, res)=>{
            res.json({name:'My User Name'})
        })
        app.use('/account', router)
    })

*But it's more or less what the helper does ;-)*

### Services helper

Documentation coming soon...

### Middleware helper

Documentation coming soon...

### Future helper, maybe...
* Sequelize
* Mongoose
* Handlerbars
* AWS (S3, DynamoDB,...)

## Full example
To see a complete example, please look in the ```example``` folder of this project

## Tests
To launch the test you just have to do:

    $ yarn install
    $ yarn  test

## License

The MIT License

Copyright (c) 2018 Thierry LESZKOWICZ <http://github.com/electrotiti>
