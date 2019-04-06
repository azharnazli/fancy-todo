const mongoose = require('mongoose')
const Schema = mongoose.Schema

function dateBeforeNow(date) {
  
}

const TodoSchema = Schema({
  title: {
    type: String,
    required: [true, `please fill title`]
  },
  body: {
    type: String,
    required: [true, `please fill body`]
  },
  finish: Boolean,
  due_date: {
    type: Date,
    required: [true, `please input your due date`],
    validate: {
      validator: function(value) {
        if(value < new Date()) return false
      },
      message: `due date cant use less then now`
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

let Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo