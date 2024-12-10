const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const {verifyToken, verifyAdmin} = require('../middlewares/auth')

const AccountController = require('../controllers/AccountController')

// ĐĂNG KÝ TÀI KHOẢN
router.post('/register',AccountController.register)
// ĐĂNG NHẬP
router.post('/login',AccountController.login)
// TÌM KIẾM TÀI KHOẢN USER (chỉ admin)
router.get('/search', verifyToken, AccountController.searchAccountUsers)
// XEM DANH SÁCH USER
router.get('/user', verifyToken, AccountController.getAllUsers)
// CHỈNH SỬA TÀI KHOẢN USER
router.put('/user/update', verifyToken, AccountController.updateUser)
// XÓA TÀI KHOẢN USER (chỉ admin)
router.delete('/user/:id', verifyToken, verifyAdmin, AccountController.deleteUser)

module.exports = router