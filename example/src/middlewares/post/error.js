module.exports = (function (err, req, res, next) {

  let httpCode = 500
  if (undefined !== err.httpCode) {
    httpCode = err.httpCode
  }

  let message = err.message

  res.status(httpCode).send({error: true, message, data: err.data || {}})
})
