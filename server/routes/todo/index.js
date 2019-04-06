const routes = require('express').Router()
const TodoController = require('../../controllers/todoController')

routes.post('/addTodo', TodoController.createTodo)
routes.get('/showAll', TodoController.findAllTodo)


module.exports = routes