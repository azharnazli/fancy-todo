const routes = require('express').Router()
const TodoController = require('../../controllers/todoController')
const authentication = require('../../middleware/authenticate')
const { authorization } = require('../../middleware/authorize')

routes.use(authentication)
routes.post('/addTodo', TodoController.createTodo)
routes.get('/showAll', TodoController.findAllTodo)
routes.patch('/finishTask/:todoId',authorization, TodoController.finishTask)
routes.delete('/finishedTask/:todoId',authorization, TodoController.finishedTask)
routes.put('/edit/:todoId', TodoController.editedTodo)


module.exports = routes