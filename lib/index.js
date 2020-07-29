const routes = require('./helpers/routes')
const services = require('./helpers/services')
const middlewares = require('./helpers/middlewares')
const generic = require('./helpers/generic')
const Initializer = require('./core/Initializer')
const Container = require('./core/Container')

module.exports = function (app, config = {}) {

  /**
   * Create an instance of Initializer to save all step
   */
  app._initializer = new Initializer();

  /**
   * Start tyboost by loading all step and dependencies
   * @returns {Promise<*>}
   */
  app.boot = async function () {
    app.set('config', config)
    app.set('container', new Container(config))
    return await app._initializer.process(app)
  }

  /**
   * Register one or multiple steps
   * @param func Function or an array of function
   * @returns {app}
   */
  app.register = function (func) {
    if (typeof func === 'function') {
      this._initializer.addStep(func)
    } else if (Array.isArray(func)) {
      func.forEach((prop) => {
        if (typeof prop !== 'function')
          throw new Error('Register function accept an array of function, got: ' + typeof func + ' in array')

        this._initializer.addStep(prop)
      })
    } else {
      throw new Error('Register function accept a function or an array of function, got: ' + typeof func)
    }

    return this;
  }

  return app
}

module.exports.routes = routes
module.exports.services = services
module.exports.middlewares = middlewares
module.exports.generic = generic
