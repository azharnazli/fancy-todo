require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const route = require('./routes')
const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(`mongodb://localhost/myTodo`,{ useNewUrlParser: true })

app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())


app.use('/', route)





app.listen(port, ()=> console.log(`linstening on port: ${port}`))