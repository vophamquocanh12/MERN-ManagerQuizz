const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const mongoose = require('mongoose')
const cors = require('cors')
dotenv.config()

const accountRouter = require('./router/account')
const categoryRouter = require('./router/category')



const connectDB = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@quizz.pz9ss.mongodb.net/`,
			{}
		)
		console.log('Mongoose connected!')
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

connectDB()

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use('/account', accountRouter)
app.use('/category', categoryRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})
