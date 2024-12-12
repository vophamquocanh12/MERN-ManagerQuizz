const {Quizz, Question, Submit} = require('../models/models')
const mongoose = require('mongoose')

const SubmitController = {
	// Nộp bài quizz (User only)
	submitQuiz: async (req, res) => {
		const {quizzId, answers} = req.body
		const userId = req.userId

		try {
			// Lấy thông tin quizz và câu hỏi
			const quizz = await Quizz.findById(quizzId).populate('questions')
			if (!quizz)
				return res
					.status(404)
					.json({success: false, message: 'Quizz not found'})

			let correctAnswersCount = 0

			// Duyệt qua từng câu trả lời
			for (const answer of answers) {
				const question = quizz.questions.find(
					(q) => q._id.toString() === answer.question
				)
				if (
					question &&
					question.options.some(
						(opt) =>
							opt.text === answer.selectedOption && opt.isCorrect
					)
				) {
					correctAnswersCount++
				}
			}

			// Tính điểm dựa trên số câu đúng và tổng số câu hỏi
			const totalQuestions = quizz.questions.length
			const score = (correctAnswersCount / totalQuestions) * 100

			// Lưu kết quả nộp bài
			const newSubmit = new Submit({
				user: userId,
				quizz: quizzId,
				answers,
				score,
			})
			await newSubmit.save()

			res.json({
				success: true,
				message: 'Quizz submitted',
				submit: newSubmit,
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({success: false, message: 'Server error'})
		}
	},

	// Lấy kết quả bài quizz (Admin hoặc User xem bài của mình)
	getQuizResults: async (req, res) => {
		try {
			const userId = req.role === 'admin' ? req.query.userId : req.userId
			const submits = await Submit.find({user: userId})
				.populate('quizz', 'title')
				.select('score quizz answers')
			res.json({success: true, submits})
		} catch (error) {
			console.error(error)
			res.status(500).json({success: false, message: 'Server error'})
		}
	},
}
module.exports = SubmitController
