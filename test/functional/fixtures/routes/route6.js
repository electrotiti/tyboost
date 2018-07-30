const express = require('express')
let router = express.Router()
router.get('/route6', (req, res) => {
  const container = req.app.get('container')
  const service4 = container.get('service4')
  res.json({data: service4.getTestData()})
})

module.exports = router
