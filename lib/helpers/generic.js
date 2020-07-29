const {walkSync} = require('../tools/utils')

function _loadByFile (path, options, callback) {
  let result = []
  const files = walkSync(path, options)

  files.forEach((file) => {
    result.push(callback(require(file)))
  })
  return result
}

function selectType (args) {
  if (Array.isArray(args[0])) {
    let result = []
    args[0].forEach((arg) => {
      result = result.concat(selectType(arg, args[1] || {}))
    })
    return result
  } else {
    const filePath = args[0]
    const options = typeof args[1] === 'object' ? args[1] : {}
    const callback = args[args.length - 1]
    return _loadByFile(filePath, options, callback)
  }
}

module.exports = function (...args) {
  return selectType(args)
}
