class Container {

  constructor (config = {}) {
    this._services = new Map()
    this._singletons = new Map()
    this._config = config
  }

  register (name, definition, dependencies = [], singleton = true) {
    if (typeof name !== "string" || name === "")
      throw new Error('Invalid name. Name should be a string', name)

    if (true === this._services.has(name))
      throw new Error('A service is already register with the name: ' + name)

    this._checkConfig(dependencies)
    this._services.set(name, {definition, dependencies, singleton})
  }

  get (name) {
    const c = this._services.get(name)

    if (c === undefined)
      throw new Error(`Unknown service with name ${name}`)

    if (this._isClass(c.definition)) {
      if (c.singleton) {
        const singletonInstance = this._singletons.get(name)
        if (singletonInstance) {
          return singletonInstance
        } else {
          const newSingletonInstance = this._createInstance(c)
          this._singletons.set(name, newSingletonInstance)
          return newSingletonInstance
        }
      }

      return this._createInstance(c)

    } else {
      return c.definition
    }
  }

  getAll () {
    return this._services
  }

  _getResolvedDependencies (service) {
    let classDependencies = []
    if (service.dependencies) {
      classDependencies = service.dependencies.map((dep) => {
        if (/^%.*%$/.test(dep)) {
          dep = dep.substr(1, dep.length - 2)
          return this._getConfig(dep)
        } else if (/^@.*/.test(dep)) {
          dep = dep.substr(1, dep.length - 1)
          return this.get(dep)
        } else {
          if (typeof dep === 'object' && dep !== null) {
            Object.entries(dep).forEach(([key, value])=>{
              if (/^%.*%$/.test(value)) {
                value = value.substr(1, value.length - 2)
                dep[key] = this._getConfig(value)
              } else if (/^@.*/.test(value)) {
                value = value.substr(1, value.length - 1)
                dep[key] = this.get(value)
              }
            })
          }

          return dep
        }
      })
    }
    return classDependencies
  }

  _getConfig (property) {
    function fetchFromObject (obj, prop) {

      if (typeof obj === 'undefined')
        throw new Error('Unable to get config property: ' + property)

      let _index = prop.indexOf('.')

      if (_index > -1)
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));

      if (obj[prop] === undefined)
        throw new Error('Unable to get config: ' + property)

      return obj[prop];
    }

    return fetchFromObject(this._config, property)
  }

  _checkConfig (dependencies) {
    const configs = dependencies.filter(dep => /^%.*%$/.test(dep))
    if (configs.length > 0) {
      configs.forEach(config => {
        this._getConfig(config.substr(1, config.length - 2))
      })
    }
  }

  _createInstance (service) {
    return new service.definition(...this._getResolvedDependencies(service))
  }

  _isClass (definition) {
    return typeof definition === 'function'
  }
}

module.exports = Container
