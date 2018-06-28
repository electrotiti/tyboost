module.exports = (function (req, res, next) {
  req.param_pre_middleware1 = true
  next()
})
