const routes = require('express').Router()
const TodoController = require('../../controllers/todoController')
const authentication = require('../../middleware/authenticate')

routes.use(authentication)
routes.post('/addTodo', TodoController.createTodo)
routes.get('/showAll', TodoController.findAllTodo)
routes.patch('/finishTask/:todoId', TodoController.finishTask)
routes.delete('/finishedTask/:todoId', TodoController.finishedTask)


module.exports = routes