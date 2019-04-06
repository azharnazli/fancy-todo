const routes = require('express').Router()
const UserController = require('../../controllers/userController')

routes.post('/register', UserController.createNormalUser)
routes.post('/loginNormal', UserController.loginNormalUser)
routes.post('/loginGoogle', UserController.loginGoogle)

module.exports = routes