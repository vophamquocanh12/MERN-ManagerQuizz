const express = require('express')
const router = express.Router()
const {verifyToken, verifyAdmin} = require('../middlewares/auth')

const QuizzController = require('./controllers/QuizzController')

// Admin: Tạo mới Quizz
router.post('/', verifyToken, verifyAdmin, QuizzController.createQuizz)
// Admin: Cập nhật Quizz
router.put('/:id', verifyToken, verifyAdmin, QuizzController.updateQuizz)
// Admin: Xóa Quizz
router.delete('/:id', verifyToken, verifyAdmin, QuizzController.deleteQuizz)
// User: Tìm kiếm Quizz theo tên
router.get('/search', verifyToken, searchQuizzes)
// User: Lấy danh sách Quizz (có sắp xếp)
router.get('/', verifyToken, QuizzController.getAllQuizzes)
// User: Lấy danh sách Quizz thuộc một Category
router.get('/category/:categoryId', verifyToken, QuizzController.getQuizzesByCategory)
// User: Lấy danh sách câu hỏi trong một Quizz
router.get('/:quizzId/questions', verifyToken, QuizzController.getQuestionsByQuizz)

module.exports = router