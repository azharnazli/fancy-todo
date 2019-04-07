const mongoose = require('mongoose')
const Schema = mongoose.Schema


function TDate(date) {
  var ToDate = new Date();

  if (new Date(date).getTime() <= ToDate.getTime()) {
    return false;
  }
  return true;
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
      validator: function (value) {
        return TDate(value)
      },
      message: `due date cant use less then now`
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})


let Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo