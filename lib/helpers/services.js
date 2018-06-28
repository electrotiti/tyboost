const {walkSync} = require('../tools/utils')
const Container = require('../core/Container')

module.exports = function (path) {
  return (app) => {
    const config = app.get('config')
    let container = app.get('context') || new Container(config)

    const files = walkSync(path)
    files.forEach((file) => {
      let name, definition, dependencies, singleton
      const service = require(file)
      if (Array.isArray(service)) {
        [name, definition, dependencies, singleton] = service
      } else {
        name = service.name
        definition = service.definition
        dependencies = service.dependencies || []
        singleton = service.singleton || true
      }
      container.register(name, definition, dependencies, singleton)
    })

    app.set('context', container)
  }
}
