const mongoose = require('mongoose')
const Schema = mongoose.Schema


function tDate(date) {
  var toDate = new Date();

  if (new Date(date).getTime() <= toDate.getTime()) {
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
        return tDate(value)
      },
      message: `due date cant use less then now`
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

TodoSchema.pre('findOneAndUpdate', function(next) {
  if(new Date(this.getUpdate().due_date) <= new Date) {
    next(new Error(`due date cant use less then now`))
  }
  if(this.getUpdate().title.length === 0) {
    next(new Error(`please input title`))
  }
  if(this.getUpdate().body.length === 0) {
    next(new Error(`please input title`))
  }
  next()
})


let Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo