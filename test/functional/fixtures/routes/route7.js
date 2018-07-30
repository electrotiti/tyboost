const express = require('express')
let router = express.Router()
router.get('/route7', (req, res) => {
  const container = req.app.get('container')
  const service5 = container.get('service5')
  res.json({data: service5.getTestData()})
})

router.get('/route7-1', (req, res) => {
  const container = req.app.get('container')
  const service6 = container.get('service6')
  const data = service6.getTestData()
  res.json({data: {res1: data.res1, res2: data.service.getTestData().res1}})
})

module.exports = router
