const express = require('express');
const Router = express.Router();
const { loginValidator, registerValidator} = require('../Helpers/Validators');
const {TokenCheck}  = require('../Middlewares/TokenCheck')

const {login,registerCustomer,verifyCustomer,getAllUsers,getUserById,getProfile,updateUser,deleteUser} = require('../Controllers/UserController')

Router.post('/login',loginValidator,login)
Router.post('/register',registerValidator,registerCustomer)

Router.post('/verify',TokenCheck,verifyCustomer)
Router.get('/',TokenCheck,getAllUsers)
Router.get('/profile',TokenCheck,getProfile)
Router.get('/:id',TokenCheck,getUserById)
Router.put('/:id',TokenCheck,updateUser)
Router.delete('/:id',TokenCheck,deleteUser)


module.exports  = Router