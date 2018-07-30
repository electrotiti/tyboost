const express = require('express')
let router = express.Router()
router.get('/route5', (req, res) => {
  const container = req.app.get('container')
  const service2 = container.get('service2')
  res.json({data: service2.getTestData()})
})


router.get('/route5/test2', (req, res) => {
  const container = req.app.get('container')
  const service3 = container.get('service3')
  res.json({data: service3.getTestData()})
})

module.exports = router
