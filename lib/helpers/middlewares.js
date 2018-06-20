const {walkSync} = require('../tools/utils')

module.exports = function (definition) {
  if (typeof definition === 'string') {
    let result = []
    const files = walkSync(`${definition}`)

    files.forEach((file) => {
      result.push((app) => {
        app.use(require(file))
      })
    })
    return result
  } else {
    return (app) => {
      app.use(definition)
    }
  }
}
