const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuizSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
})

module.exports = mongoose.model('Quiz', QuizSchema)