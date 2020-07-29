const fs = require('fs')

const walkSync = (rootPath, options = {}) => {

  const depth = options.depth || 10000000
  const extensions = options.exts || Object.keys(require.extensions).map(ext => ext)
  const exts = extensions.map(ext => ext[0] !== '.' ? ext : ext.slice(1))
  const regexExt = new RegExp('\\.(' + exts.join('|') + ')$')
  const regex = options.regex || null

  let level = 0
  let list = []
  if (fs.lstatSync(rootPath).isDirectory()) {
    const _readSubFolder = (path) => {
      level++
      const files = fs.readdirSync(path)
      files.forEach((file) => {
        if (fs.lstatSync(`${path}/${file}`).isDirectory() && depth >= level) {
          _readSubFolder(`${path}/${file}`)
        } else {
          if (regexExt.test(file)) {
            const relativePath = path.replace(rootPath,'').trim()
            // console.log(`${relativePath}/${file}`)
            // console.log(regex.test(`${relativePath}/${file}`))
            if (regex === null || relativePath === '' || regex.test(`${relativePath}/${file}`)){
              list.push(`${path}/${file}`)
            }
          }
        }
      })
    }
    _readSubFolder(rootPath, rootPath)
  } else {
    list.push(rootPath)
  }

  return list
}

module.exports.walkSync = walkSync
