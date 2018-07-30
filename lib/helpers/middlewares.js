const {walkSync} = require('../tools/utils')

function _loadByFile (path, options = {}) {
  let result = []
  const files = walkSync(path, options)

  files.forEach((file) => {
    result.push((app) => {
      app.use(require(file))
    })
  })
  return result
}

function selectType (...args) {
  if (Array.isArray(args[0])) {
    let result = []
    args[0].forEach((arg) => {
      result = result.concat(selectType(arg, args[1] || {}))
    })
    return result
  } else {
    switch (typeof args[0]) {
      case 'string':
        return _loadByFile(args[0], args[1] || {})
      case 'function':
        return (app) => {
          app.use(args[0])
        }
      default:
        throw new Error('Invalid argument')
    }
  }
}

module.exports = function (args) {
  return selectType(args)
}
