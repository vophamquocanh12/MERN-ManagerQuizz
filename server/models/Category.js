const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 50,
		},
		description: {
			type: String,
		},
	},
	{timestamps: true}
)

module.exports = mongoose.model('Category', CategorySchema)
