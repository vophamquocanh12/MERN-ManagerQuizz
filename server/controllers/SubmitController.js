const {Quizz, Question} = require('../models/models')
const mongoose = require('mongoose')

const SubmitController = {
	// Nộp bài quiz (User only)
	submitQuiz: async (req, res) => {
		const {quizzId, answers} = req.body
		const userId = req.userId

		try {
			// Tính điểm
			const quiz = await Quiz.findById(quizzId).populate('questions')
			if (!quiz)
				return res
					.status(404)
					.json({success: false, message: 'Quiz not found'})

			let score = 0
			for (const answer of answers) {
				const question = quiz.questions.find(
					(q) => q._id.toString() === answer.question
				)
				if (
					question &&
					question.options.some(
						(opt) =>
							opt.text === answer.selectedOption && opt.isCorrect
					)
				) {
					score++
				}
			}

			const newSubmit = new Submit({
				user: userId,
				quizz: quizzId,
				answers,
				score,
			})
			await newSubmit.save()
			res.json({
				success: true,
				message: 'Quiz submitted',
				submit: newSubmit,
			})
		} catch (error) {
			console.error(error)
			res.status(500).json({success: false, message: 'Server error'})
		}
	},

	// Lấy kết quả bài quiz (Admin hoặc User xem bài của mình)
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
