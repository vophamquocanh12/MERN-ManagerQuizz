const {Question, Quizz} = require('../models/models')
const mongoose = require('mongoose')

const QuestionController = {
	// TẠO MỚI CÂU HỎI
	createQuestion: async (req, res) => {
		const {questionText, options, quizzId} = req.body
		try {
			// Kiểm tra nếu Quizz tồn tại
			const quizz = await Quizz.findById(quizzId)
			if (!quizz) {
				return res
					.status(404)
					.json({success: false, message: 'Quizz not found'})
			}

			// Tạo câu hỏi mới
			const newQuestion = new Question({questionText, options})
			await newQuestion.save()

			// Thêm câu hỏi vào Quizz
			quizz.questions.push(newQuestion._id)
			await quizz.save()

			return res.status(201).json({
				success: true,
				message: 'Question created and linked to Quizz successfully',
				question: newQuestion,
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// CHỈNH SỬA CÂU HỎI
	updateQuestion: async (req, res) => {
		const {id} = req.params // ID của câu hỏi cần chỉnh sửa
		const {questionText, options} = req.body // Dữ liệu cập nhật 
		try {
			// Tìm câu hỏi cần chỉnh sửa
			const updatedQuestion = await Question.findByIdAndUpdate(
				id,
				{questionText, options, updatedAt: Date.now()},
				{new: true} // Trả về bản ghi đã cập nhật
			)

			if (!updatedQuestion) {
				return res
					.status(404)
					.json({success: false, message: 'Question not found'})
			}

			// Lấy tất cả các Quizz chứa câu hỏi này
			const quizzes = await Quizz.find({questions: id})

			// Đồng bộ thông tin trong các Quizz nếu cần
			for (let quizz of quizzes) {
				// Trường hợp cần xử lý logic đồng bộ phức tạp hơn, bạn có thể kiểm tra tại đây.
				await quizz.save()
			}

			return res.status(200).json({
				success: true,
				message:
					'Question updated successfully and synced with Quizzes',
				question: updatedQuestion,
			})
		} catch (error) {
			console.error(error)
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// XÓA CÂU HỎI
	deleteQuestion: async (req, res) => {
		const {id} = req.params
		try {
			const deletedQuestion = await Question.findByIdAndDelete(id)
			if (!deletedQuestion) {
				return res
					.status(404)
					.json({success: false, message: 'Question not found'})
			}

			// Gỡ bỏ câu hỏi khỏi các Quizz liên quan
			await Quizz.updateMany({questions: id}, {$pull: {questions: id}})

			return res.status(200).json({
				success: true,
				message:
					'Question deleted and unlinked from Quizz successfully',
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// LẤY DANH SÁCH TẤT CẢ CÂU HỎI
	getAllQuestions: async (req, res) => {
		try {
			const questions = await Question.find()
			return res.status(200).json({
				success: true,
				questions,
			})
		} catch (error) {
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// LẤY CHI TIẾT CÂU HỎI
	getQuestionById: async (req, res) => {
		const {id} = req.params
		try {
			const question = await Question.findById(id)
			if (!question) {
				return res
					.status(404)
					.json({success: false, message: 'Question not found'})
			}
			return res.status(200).json({
				success: true,
				question,
			})
		} catch (error) {
			return res
				.status(500)
				.json({success: false, message: 'Server error'})
		}
	},
	// LẤY DANH SÁCH CÂU HỎI LIÊN KẾT VỚI QUIZZ
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
				.status(500)
				.json({success: false, message: 'Server error'})
		}
	},
}

module.exports = QuestionController
