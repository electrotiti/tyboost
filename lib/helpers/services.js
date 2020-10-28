const {walkSync} = require('../tools/utils')

function _register (service) {
  return (app) => {
    let container = app.get('container')
    let name, definition, dependencies, singleton

    if (Array.isArray(service)) {
      [name, definition, dependencies, singleton] = service
      dependencies = dependencies || []
      singleton = singleton === undefined ? true : singleton
    } else {
      name = service.name
      definition = service.definition
      dependencies = service.dependencies || []
      singleton = service.singleton || true
    }
    container.register(name, definition, dependencies, singleton)
  }
}

function _loadByFile (path, options = {}) {
  let result = []
  const files = walkSync(path, options)

  files.forEach((file) => {
    result.push(_register(require(file)))
  })
  return result
}

function selectType (...args) {
  if (Array.isArray(args[0])) {
    let result = []
    args[0].forEach((arg) => {
      result = result.concat(selectType(arg))
    })
    return result
  } else {
    switch (typeof args[0]) {
      case 'string':
        return _loadByFile(args[0], args[1] || {})
      case 'object':
        return _register(args[0])
      default:
        throw new Error('Invalid argument', )
    }
  }
}

module.exports = function (args) {
  return selectType(args)
}
