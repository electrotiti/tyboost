const express = require('express')
let router = express.Router()
router.get('/route1', (req, res) => {
  res.json({data: 'data1'})
})

router.post('/route1', (req, res) => {
  const data = req.body.data
  res.json({data})
})

module.exports = router
