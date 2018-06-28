# Tyboost
[![Build Status](https://travis-ci.com/electrotiti/tyboost.svg?branch=master)](https://travis-ci.com/electrotiti/tyboost)

[![NPM](https://nodei.co/npm-dl/tyboost.png?height=3)](https://nodei.co/npm/tyboost/)
[![NPM](https://nodei.co/npm/tyboost.png)](https://nodei.co/npm/tyboost/)

Initialization layer and tools for Node.js applications.

Tyboost allows initialization steps to be registered for an application. 
All these steps will be executed sequentially during startup, after which the application will be ready to run.

Tyboost also provides several helpers to load components such as routes handlers, 
services with IOC, middlewares, etc.

## Table of contents
- [Installation](#install)
- [Usage](#usage)
- [Register step](#register-step)
  - [Helpers registration](#helpers-registration)
  - [Manually registration](#manually-registration)
  - [Order of execution](#order-of-execution)
- [Boot application](#boot-application)
- [Express JS Helpers](#express-js-helpers)
  - [Routes helper](#routes-helper)
  - [Services helper](#services-helper)
  - [Middleware helper](#middleware-helper)
- [Example](#example)
- [Tests](#tests)
- [License](#license)
 
## Installation
```bash
$ npm install tyboost
```
## Usage

Tyboost should be applicable to any Node.js application. 
Currently it has been tested with Express Js which is one of the most common Framework

```js
const express = require('express')
const tyboost = require('tyboost')
const config = require('./application-config.json')
```

const app = tyboost(express(), config)

This will create an Express Js application with two additional functions: ```app.register()``` and ```app.boot()```
The first one is use to register a step, (manually or with helpers) and the second one is use to boot the application
by executed all registered steps. 

The **config** parameter is an object with your own configuration of your application. 
It will be available in the IOC container and in the "config" parameter of your Express JS application 
by calling ```app.get('config')```


## Register step
When starting a Node JS application, some steps must be executed sequentially, 
such as loading routes, creating services, connecting to databases or registering middleware.

### Helpers registration
Tyboost provides several helpers, check the helpers section for more informations

```js
app.register(tyboost.services('/path/to/the/services'))
app.register(tyboost.routes('/path/to/the/routes'))
app.register(tyboost.middlewares('/path/to/the/middleware'))
```

### Manually registration

You can register manually a function or an array of function

```js
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
```

### Order of execution 

Each step will be executed following the order of registration, **BUT ONLY** if the step is **synchronous** 
or if **the step return a promise**. 
An async function like ```setTimeout``` will not be execute in the registration flow order
(even it can be execute after boot of application)

```js
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
```

## Boot application

Call ```app.boot``` to boot your application, this will return a promise. 
Registered steps will be executed sequentially, and the promise will be resolve when all steps are complete.

Example with the default promise syntax:

```js
app.boot()
   .then(()=>{
       app.listen(8080, () => {
           console.log('Listen on port 8080')
       })
   })
   .catch((err)=>{
       console.log(err)
   })
```

Example with await/async syntax:

```js
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
```

## Express JS Helpers
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
```js
let router = express.Router()
router.get('/user', (req, res)=>{
    res.json({name:'My User Name'})
})

module.exports = router
```

File Login.js:

```js
let router = express.Router()
router.post('/login', (req, res)=>{
    // Authentification...
    res.json({ logged:true })
})

module.exports = router
```

To load the routes call the helper like this:
```js
app.register(tyboost.routes(__dirname + 'src/handler'))
```
You can add prefix ```/api``` a the beginning of your route like this:
```js
app.register(tyboost.routes(__dirname + 'src/handler'), '/api')
```
You can also call this helper with only with one file
```js    
app.register(tyboost.routes(__dirname + 'src/handler/account/User.js'))
```
This helper is to help you to load quickly your routes but you can do this manually like this:

```js
let router = express.Router()
app.register(() => {
    router.get('/user', (req, res)=>{
        res.json({name:'My User Name'})
    })
    app.use('/account', router)
})
```

*But it's more or less what the helper does ;-)*

### Services helper
The services helpers allows you to load multiple services in an IOC (Inversion Of Control) container. 
This container will be available in the "context" parameter of the NodeJS application and usable for instance in route handler.

Each file must return an array (or an object) with a service definition, containing the following parameters:

* Unique service name (REQUIRED)
* Definition of Class (REQUIRED)
* Array of dependencies (OPTIONAL, default: [])
* A boolean that define if the service is a singleton (OPTIONAL, default: true)    

The values in _dependencies_ object the name of an other service or a config parameters of the main configuration.

Example of a simple service:

```js
const Service = class Service {

    constructor (otherService, param1, param2) {
    // Do something
    }
    
    myFunc() {
    // Do something
    }
}

module.exports = ['service1', Service, ['service2', '%param1%', '%section1.param2%'], true]
```

or with an object:

```js
module.exports =  { name: 'service1', 
                    definition: Service,
                    dependencies: ['service2', '%param1%', '%section1.param2%'],
                    singleton: true }
```

After creation your service file you have to call Tyboost with a config object 
(only if you use config in your service) and call the service helper:

```js
const express = require('express')
const tyboost = require('tyboost')
const config = {param1: "value1", section1: {param2: "value2"}}

const app = tyboost(express(), config)

app.register(tyboost.services('/path/to/the/services'))
```

After this you can use the container in an route like this:

```js
router.get('/my-route', (req, res)=>{
    const context = req.app.get('context').get('service1')
    const service = context.get('service1')
    const result = service.myFunc()
    
    res.json(result)
})
```

### Middleware helper
The routes helpers allows you to load multiple middleware from a folder (including the sub folder) at one time.
Each file have to return a function.

If you want that your middleware to be execute before route Handler you have to call the middleware helper before loading route. 
By the way, if you want to register a middleware that catch all error, you have to call the middleware helper after all the other registration.

Example with two middleware:

```js
app.register(tyboost.middlewares('/path/to/the/middleware_pre_handler'))
app.register(tyboost.routes('/path/to/the/routes'))
app.register(tyboost.middlewares('/path/to/the/middleware_post_handler'))
```

## Example
To see a complete example, please look in the [example](https://github.com/electrotiti/tyboost/tree/master/example "Tyboost Example folder") folder of this project

## Tests
To launch the test you just have to do:

```bash
$ npm install
$ npm test
```
    
## License

The MIT License

Copyright (c) 2018 Thierry LESZKOWICZ <http://github.com/electrotiti>
