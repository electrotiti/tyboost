let local = {}
module.exports = {
  set: (name, value) => {
    local[name] = value
  },

  get: (name) => {
    if (local[name] === undefined)
      throw new Error(`Unknown ${name} in app context`)

    return local[name]
  }
}
