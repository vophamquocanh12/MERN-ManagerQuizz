const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema(
	{
		questionText: {
			type: String,
			required: true,
		},
		options: [
			{
				text: {type: String, required: true},
				isCorrect: {type: Boolean, required: true},
			},
		],
		
	},
	{timestamps: true}
)
module.exports = mongoose.model('Question', QuestionSchema)
