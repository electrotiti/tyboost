const express = require('express')
let router = express.Router()
router.get('/route4', (req, res) => {
  const context = req.app.get('context')
  const service1 = context.get('service1')
  res.json({data: service1.getTestData()})
})

module.exports = router
