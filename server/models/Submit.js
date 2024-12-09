const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubmitSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
	},
	quizz: {
		type: Schema.Types.ObjectId,
		ref: 'Quizz',
	},
	answers: [
		{
			question: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
			selectedOption: String,
		},
	],
	score: Number,
})

module.exports = mongoose.model('Submit', SubmitSchema)