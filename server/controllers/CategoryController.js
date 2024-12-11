const {Category} = require('../models/models')
const mongoose = require('mongoose')

const CategoryController = {
	// TẠO MỚI PHÂN LỚP
	createCategory: async (req, res) => {
		const {name, description} = req.body

		try {
			const newCategory = await Category({name, description})
			await newCategory.save()
			return res.status(201).json({
				success: true,
				message: 'Category created successfully',
				category: newCategory,
			})
		} catch (error) {
			console.log(error)

			return res.status(500).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// LẤY DANH SÁCH TẤT CẢ PHÂN LỚP
	getAllCategories: async (req, res) => {
		try {
			const categories = await Category.find()
			return res.status(200).json({
				success: true,
				categories,
			})
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// XEM CHI TIẾT MỘT PHÂN LỚP
	getCategoryById: async (req, res) => {
		const {id} = req.params
		try {
			const category = await Category.findById(id)
			if (!category) {
				return res.status(404).json({
					success: false,
					message: 'Category not found',
				})
			}
			return res.status(200).json({
				success: true,
				category,
			})
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// CẬP NHẬT PHÂN LỚP
	updateCategory: async (req, res) => {
		const {id} = req.params
		const {name, description} = req.body

		try {
			const updatedCategory = await Category.findByIdAndUpdate(
				id,
				{name, description, updatedAt: Date.now()},
				{new: true}
			)

			if (!updatedCategory) {
				return res.status(404).json({
					success: false,
					message: 'Category not found',
				})
			}
			// Cập nhật thông tin category trong các Quiz liên quan
			// await Quiz.updateMany(
			// 	{category: id},
			// 	{category: updatedCategory._id}
			// )
			return res.status(200).json({
				success: true,
				message: 'Category updated successfully',
				category: updatedCategory,
			})
		} catch (error) {
			console.log(error)

			return res.status(400).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// TÌM KIẾM MỘT PHÂN LỚP
	searchCategories: async (req, res) => {
		const {q} = req.query
		if (!q || q.trim() === '') {
			return res.status(400).json({
				success: false,
				message: 'Query parameter is missing or empty',
			})
		}

		try {
			const categories = await Category.find({
				name: {$regex: q, $options: 'i'},
			})
			return res.json({success: true, categories})
		} catch (error) {
			console.log(error)
			return res
				.status(500)
				.json({success: false, message: 'Internal server error'})
		}
	},
	// XÓA MỘT PHÂN LỚP
	deleteCategory: async (req, res) => {
		const {id} = req.params
		try {
			const deletedCategory = await Category.findByIdAndDelete(id)
			if (!deletedCategory) {
				return res
					.status(404)
					.json({success: false, message: 'Category not found'})
			}
			return res.status(200).json({
				success: true,
				message: 'Category deleted successfully',
			})
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: 'Server error deleting category',
			})
		}
	},
}

module.exports = CategoryController
