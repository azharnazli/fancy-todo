const User = require('../models/user')
const { sign } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const { compare } = require('../helpers/bcrypt')


class UserController {

  static createNormalUser(req, res) {
    User.create({
      password: req.body.password,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    })
      .then((user) => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }

  static loginNormalUser(req, res) {
    User.findOne({email : req.body.email})
      .then((foundUser) => {
        if(!foundUser) {
          res.status(400).json({errors: `wrong email`})
        } else {
          if(!compare(req.body.password, foundUser.password)) {
            res.status(400).json({errors: `wrong password `})
          } else {
            let token = sign({
              _id : foundUser._id,
              email: req.body.email
            })
            res.status(200).json(token)
          }
        }
      })
      .catch(err => {
        res.status(500).json(err.message)
      })
  }

  static loginGoogle(req, res) {
    let payload = {}
    client.verifyIdToken({
      idToken : req.body.token,
      audience: process.env.CLIENT_ID
    })
    .then( ticket=> {
      payload = ticket.getPayload()
      return User.findOne({email : payload.email})
    })
    .then( found => {
      if(!found) {
      return User.create({
          email: payload.email,
          password: 12345,
          first_name: payload.given_name,
          last_name: payload.family_name
        })
      } else {
        let token = sign({
          _id : found._id,
          email : payload.email
        })
        res.status(200).json(token)
      }
    })
    .then( (data) => {
      if(data) {
        let token = sign({
          _id : data._id,
          email : data.email
        })
        res.status(201).json(token)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
  }

}

module.exports = UserController