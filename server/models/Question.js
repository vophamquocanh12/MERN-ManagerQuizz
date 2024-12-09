const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean,
    }]
})
module.exports = mongoose.model('Question', QuestionSchema)