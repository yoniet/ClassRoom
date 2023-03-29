const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes')

app.use('/', userRoutes)
// app.use('/', authRoutes)


module.exports = app