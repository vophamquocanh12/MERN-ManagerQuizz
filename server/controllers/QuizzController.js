const {Quizz, Account, Category} = require('../models/models')
const mongoose = require('mongoose')


const QuizzController = {
	// TẠO MỚI QUIZZ
	createQuizz: async (req, res) => {
		const {title, description, category, questions} = req.body
		if (!title) {
			return res.status(400).json({
				success: false,
				message: 'Title is required',
			})
		}
		try {
			// kiểm tra danh mục categories
			const categoryExist = await Category.findById(category)
			if (!categoryExist) {
				return res.status(400).json({
					success: false,
					message: 'Category does not exist',
				})
			}
			// tạo quizz
			const newQuizz = new Quizz({
				title,
				description,
				category,
				questions,
				createdBy: req.userId,
			})
			await newQuizz.save()
			return res.status(200).json({
				success: true,
				message: 'Quizz created successfully',
			})
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// CHỈNH SỬA QUIZZ
	updateQuizz: async (req, res) => {
		const {id} = req.params
		const {title, description, category, questions} = req.body
		try {
			const updatedQuizz = await Quizz.findById(
				id,
				{
					title,
					description,
					category,
					questions,
					updatedAt: Date.now(),
				},
				{new: true}
			)
			if (!updatedQuizz) {
				return res.status(404).json({
					success: false,
					message: 'Quizz not found',
				})
			}
			return res.status(200).json({
				success: true,
				message: 'Quizz updated successfully',
				quizz: updatedQuizz,
			})
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// XÓA QUIZZ
	deleteQuizz: async (req, res) => {
		const {id} = req.params
		try {
			const deletedQuizz = await Quizz.findByIdAndDelete(id)
			if (!deletedQuizz) {
				return res.status(404).json({
					success: false,
					message: 'Quizz not found',
				})
			}
			return res.status(200).json({
				success: true,
				message: 'Quizz deleted successfully',
			})
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// TÌM KIẾM QUIZZ
	searchQuizzes: async (req, res) => {
		const {q} = req.query
		try {
			const quizzes = await Quizz.find({
				name: {$regex: q, $options: 'i'},
			}) // Tìm kiếm theo tên
			return res.status(200).json({
				success: true,
				quizzes,
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// LẤY DANH SÁCH QUIZZ
	getAllQuizzes: async (req, res) => {
		const {sortBy = 'createdAt', order = 'desc'} = req.query // Mặc định sắp xếp theo thời gian giảm dần
		try {
			const quizzes = await Quizz.find().sort({
				[sortBy]: order === 'asc' ? 1 : -1,
			})
			return res.status(200).json({
				success: true,
				quizzes,
			})
		} catch (error) {
			return res.status(400).json({
				success: false,
				message: 'Server error',
			})
		}
	},
	// LẤY DANH SÁCH QUIZZ THEO CATEGORY
	getQuizzesByCategory: async (req, res) => {
		const {categoryId} = req.params
		try {
			const quizzes = await Quizz.find({category: categoryId})
			return res.status(200).json({
				success: true,
				quizzes,
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// LẤY DANH SÁCH CÂU HỎI TRONG QUIZZ
	getQuestionsByQuizz: async (req, res) => {
		const {quizzId} = req.params
		try {
			const quizz = await Quizz.findById(quizzId).populate('questions')
			if (!quizz) {
				return res
					.status(404)
					.json({success: false, message: 'Quizz not found'})
			}
			return res.status(200).json({
				success: true,
				questions: quizz.questions,
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
}

module.exports = QuizzController
