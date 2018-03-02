const router = require('express').Router()
const controller = require('./auth.controller')
const authMiddleware = require('../../../middlewares/auth')

router.post('/register', controller.register)
router.post('/login', controller.login)

router.use('/check', authMiddleware)
router.post('/check', controller.check)
router.get('/me', controller.me)

module.exports = router
