const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	description: {
		type: String,
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

module.exports = mongoose.model('Category', CategorySchema)