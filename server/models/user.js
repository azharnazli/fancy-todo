const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {
  hash
} = require('../helpers/bcrypt')

const UserSchema = new Schema({
  password: {
    type: String,
    minlength : [5, `password must be 5 till 12 characters`],
    maxlength: [12, `password must be 5 till 12 characters`],
    required: [true, `please input your password`],
  },
  email: {
    type: String,
    required: [true, `please input your email`],
    validate: [{
      validator: function (value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(value).toLocaleLowerCase())
      },
      message: `email format error`
    }, {
      validator: function (value) {
        return User.findOne({
          _id : {
            $ne : this._id
          },
          email : value
        })
          .then((found) => {
            if(found) return false
          })
      },
      message: `email already registered`
    }]
  },
  first_name: {
    type: String,
    minlength : [5, `password must be 5 till 12 characters`],
    maxlength: [12, `password must be 5 till 12 characters`],
    required: [true, `please input your first name`],
  },
  last_name: {
    type: String,
    minlength : [5, `password must be 5 till 12 characters`],
    maxlength: [12, `password must be 5 till 12 characters`],
    required: [true, `please input your last name`]
  }
})

UserSchema.pre('save', function (next) {
  this.password = hash(this.password)
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User