const Todo = require('../models/todo')
const { verify } = require('../helpers/jwt')

class TodoController{

  static findAllTodo(req, res) {
    let owner = verify(req.headers.token)
    Todo.find({
      owner
    })
      .then((todos) => {
        res.status(200).json(todos)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static createTodo(req, res) {
    let owner = verify(req.headers.token)
    Todo.create({
    title: req.body.title,
    body: req.body.body,
    finish: false,
    due_date: req.body.due_date,
    owner,
    })
    .then((todo) => {
      res.status(201).json(todo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
}

module.exports = TodoController