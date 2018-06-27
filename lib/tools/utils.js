const fs = require('fs')

const walkSync = (rootPath) => {

  let list = []
  if (fs.lstatSync(rootPath).isDirectory()) {
    const _readSubFolder = (path) => {
      const files = fs.readdirSync(path)
      files.forEach((file) => {
        if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
          _readSubFolder(`${path}/${file}`)
        } else {
          list.push(`${path}/${file}`)
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
