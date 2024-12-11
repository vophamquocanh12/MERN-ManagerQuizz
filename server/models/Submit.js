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
	score: {
		type: Number,
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

module.exports = mongoose.model('Submit', SubmitSchema)