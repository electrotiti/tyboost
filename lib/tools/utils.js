const fs = require('fs')

const walkSync = (rootPath, options = {}) => {

  const depth = options.depth || 10000000
  const extensions = options.exts || Object.keys(require.extensions).map(ext => ext)
  const exts = extensions.map(ext => ext[0] !== '.' ? ext : ext.slice(1))
  const regex = new RegExp('\\.(' + exts.join('|') + ')$')

  let level = 0
  let list = []
  if (fs.lstatSync(rootPath).isDirectory()) {
    const _readSubFolder = (path) => {
      level++
      const files = fs.readdirSync(path)
      files.forEach((file) => {
        if (fs.lstatSync(`${path}/${file}`).isDirectory() && depth > level) {
          _readSubFolder(`${path}/${file}`)
        } else {
          if (regex.test(file)) {
            list.push(`${path}/${file}`)
          }
        }
      })
    }
    _readSubFolder(rootPath)
  } else {
    list.push(rootPath)
  }

  return list
}

module.exports.walkSync = walkSync
