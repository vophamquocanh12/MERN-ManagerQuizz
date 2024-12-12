const express = require('express')
const router = express.Router()
const {verifyToken, verifyUser} = require('../middlewares/auth')
const SubmitController = require('../controllers/SubmitController')

// User: Nộp bài quizz
router.post('/', verifyToken, verifyUser, SubmitController.submitQuiz)

// User hoặc Admin: Xem kết quả quizz
router.get('/', verifyToken, SubmitController.getQuizResults)

module.exports = router
