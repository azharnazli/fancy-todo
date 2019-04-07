const Todo = require('../models/todo')

class TodoController{

  static findAllTodo(req, res) {
    Todo.find({
      owner:req.authenticated._id
    })
    .populate('owner',['_id','email'],'User')
      .then((todos) => {
        // console.log(todos)
        res.status(200).json(todos)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static createTodo(req, res) {
    Todo.create({
    title: req.body.title,
    body: req.body.body,
    finish: false,
    due_date: req.body.due_date,
    owner:req.authenticated._id,
    })
    .then((todo) => {
      res.status(201).json(todo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static finishTask(req, res) {
    Todo.findById(req.params.todoId)
      .then((todo) => {
        todo.finish = true,
        todo.save()
        res.status(200).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static finishedTask(req, res) {
    Todo.findByIdAndDelete(req.params.todoId)
      .then((todo) => {
        res.status(200).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}

module.exports = TodoController