const express = require('express')
const router = express.Router()
const {verifyToken, verifyAdmin} = require('../middlewares/auth')

const QuestionController = require('../controllers/QuestionsController')

// Admin: Tạo mới câu hỏi
router.post('/', verifyToken, verifyAdmin, QuestionController.createQuestion);
// Admin: Cập nhật câu hỏi
router.put('/:id', verifyToken, verifyAdmin, QuestionController.updateQuestion);
// Admin: Xóa câu hỏi
router.delete('/:id', verifyToken, verifyAdmin, QuestionController.deleteQuestion);
// User: Lấy danh sách tất cả câu hỏi
router.get('/', verifyToken, QuestionController.getAllQuestions);
// User: Lấy chi tiết một câu hỏi
router.get('/:id', verifyToken, QuestionController.getQuestionById);
// User: Lấy danh sách câu hỏi liên kết với một Quizz
router.get('/:quizzId', verifyToken, QuestionController.getQuestionsByQuizz)

module.exports = router;