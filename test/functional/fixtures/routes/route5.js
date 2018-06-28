const express = require('express')
let router = express.Router()
router.get('/route5', (req, res) => {
  const context = req.app.get('context')
  const service2 = context.get('service2')
  res.json({data: service2.getTestData()})
})


router.get('/route5/test2', (req, res) => {
  const context = req.app.get('context')
  const service3 = context.get('service3')
  res.json({data: service3.getTestData()})
})

module.exports = router
