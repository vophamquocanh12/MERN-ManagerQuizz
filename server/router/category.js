const express = require('express')
const router = express.Router()
const {verifyToken, verifyAdmin} = require('../middlewares/auth')

const CategoryController = require('../controllers/CategoryController')

// Admin: Tạo phân lớp
router.post('/',verifyToken,verifyAdmin, CategoryController.createCategory)
// TÌM KIẾM MỘT PHÂN LỚP
router.get('/search', verifyToken, CategoryController.searchCategories)
// Admin & User: Lấy danh sách phân lớp
router.get('/', verifyToken, CategoryController.getAllCategories)
// XEM CHI TIẾT MỘT PHÂN LỚP
router.get('/:id', verifyToken, CategoryController.getCategoryById)
// CẬP NHẬT PHÂN LỚP
router.put('/:id', verifyToken, verifyAdmin, CategoryController.updateCategory)
// Admin: Xóa phân loại
router.delete('/:id', verifyToken, verifyAdmin, CategoryController.deleteCategory)

module.exports = router