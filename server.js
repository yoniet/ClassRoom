
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path')



const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const courseRoutes = require('./routes/course.routes')
const enrollmentRoutes = require('./routes/enrollment.routes')

mongoose.connect(process.env.MONGODB_URI)

app.set("views", "./public")
app.use(express.static("public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname) + '/public/' ,'index.html')
})



const start = async () => {
    app.listen(3000, console.log('server is running'))
}

start()

