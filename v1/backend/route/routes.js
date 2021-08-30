const express = require("express");
const LoginController = require("../controller/login-controller");
const UserController = require("../controller/user-controller");

const route = express.Router();

route.post('/login', LoginController.login);

route.get('/', UserController.getUsers);
route.post('/add', UserController.addUser);
route.get('/:id', UserController.getUserById);
route.put('/:id', UserController.editUser);
route.delete('/:id', UserController.deleteUser);

module.exports = route;