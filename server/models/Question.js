const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
	questionText: {
		type: String,
		required: true,
	},
	options: [
		{
			text: String,
			isCorrect: Boolean,
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})
module.exports = mongoose.model('Question', QuestionSchema)
