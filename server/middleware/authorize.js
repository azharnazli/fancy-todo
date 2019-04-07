const Todo = require('../models/todo')

module.exports = {
  authorization: function (req, res, next) {
    Todo.findOne({
        _id: req.params.todoId
      })
      .populate('owner')
      .then(data => {
        if (data.owner.email === req.authenticated.email) {
          next()
        } else {
          res.status(401).json({
            errors: {
              message: 'You dont have access for modify this todo'
            }
          })
        }
      })
  }
}