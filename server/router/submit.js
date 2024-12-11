const express = require('express')
const router = express.Router()
const {verifyToken, verifyUser} = require('../middleware/auth')
const SubmitController = require('../controllers/SubmitController')

// User: Nộp bài quiz
router.post('/', verifyToken, verifyUser, SubmitController.submitQuiz)

// User hoặc Admin: Xem kết quả quiz
router.get('/', verifyToken, SubmitController.getQuizResults)

module.exports = router
