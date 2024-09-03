const express = require('express')
const app = express();
const employeeRouter = require('./employeeRouter')
const authRouter = require('./authRouter')

app.use('/api',employeeRouter)
app.use('/api/auth',authRouter)

module.exports= app;