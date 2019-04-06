const routes = require('express').Router()
const users = require('./user')
const todos = require('./todo')

routes.use('/users', users)
routes.use('/todos', todos)




module.exports = routes