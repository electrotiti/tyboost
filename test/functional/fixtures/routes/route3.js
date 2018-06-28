const express = require('express')
let router = express.Router()
router.get('/route3', (req, res) => {

  if (req.query.force_error)
    throw new Error('Force error')

  if (req.param_pre_middleware1 === true) {
    res.json({param_pre_middleware1: 'OK'})
  } else {
    res.json({param_pre_middleware1: 'FAIL'})
  }

})

module.exports = router
