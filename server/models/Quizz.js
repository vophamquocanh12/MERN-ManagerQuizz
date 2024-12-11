const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuizSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	questions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Question',
		},
	],
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category', // Liên kết với Category
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Quiz', QuizSchema)
