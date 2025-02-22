const express = require('express')
const router = express.Router()
const controllers = require('./controllers')

//TODO: add confirm password field
router.post('/register', (req, res) => {controllers.RegisterNewUser(req, res)})


module.exports = router