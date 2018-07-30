const express = require('express')
let router = express.Router()
router.get('/route4', (req, res) => {
  const container = req.app.get('container')
  const service1 = container.get('service1')
  res.json({data: service1.getTestData()})
})

module.exports = router
