const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuizzSchema = new Schema(
	{
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
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
	},
	{timestamps: true}
)
module.exports = mongoose.model('Quizz', QuizzSchema)
