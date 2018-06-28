const express = require('express')
let router = express.Router()
router.get('/route2', (req, res) => {
  res.json({data: 'data2'})
})

router.post('/route2', (req, res) => {
  const data = req.body.data
  res.json({data})
})

module.exports = router
