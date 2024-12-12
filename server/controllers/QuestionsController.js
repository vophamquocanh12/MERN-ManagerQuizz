const {Question, Quizz} = require('../models/models')
const mongoose = require('mongoose')

const QuestionController = {
	// TẠO MỚI CÂU HỎI
	createQuestion: async (req, res) => {
		const {questionText, options} = req.body

		try {
			// Tạo câu hỏi mới
			const newQuestion = new Question({questionText, options})
			await newQuestion.save()

			return res.status(201).json({
				success: true,
				message: 'Question created successfully',
				question: newQuestion,
			})
		} catch (error) {
			console.log(error);
			
			return res
				.status(400)
				.json({success: false, message: 'Server error'})
		}
	},
	// CHỈNH SỬA CÂU HỎI
	updateQuestion: async (req, res) => {
		const {id} = req.params // ID của câu hỏi cần chỉnh sửa
		const {questionText, options, quizzIds} = req.body // Dữ liệu cập nhật, bao gồm quizzIds

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

			// Thêm câu hỏi vào tất cả các quizz liên quan (quizzIds là mảng chứa các quizz mà câu hỏi này sẽ được thêm vào)
			for (let quizzId of quizzIds) {
				const quizz = await Quizz.findById(quizzId)
				if (quizz && !quizz.questions.includes(id)) {
					quizz.questions.push(id) // Thêm câu hỏi vào quizz
					await quizz.save()
				}
			}

			return res.status(200).json({
				success: true,
				message: 'Question updated and linked to quizzes successfully',
				question: updatedQuestion,
			})
		} catch (error) {
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
