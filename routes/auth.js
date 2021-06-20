const express = require('express')

const router = express.Router()
const {register, login, home, logout, remains} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login)
router.get('/',home)
router.get('/logout',logout)



module.exports = router; 