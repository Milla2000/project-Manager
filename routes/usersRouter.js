const {Router} = require('express');
const { registerUsers, userLogin, checkUser } = require('../controllers/authControllers');
const { assignProjects } = require('../controllers/projectController');
const { completeProject, returnUsers } = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');
const usersRouter = Router()

usersRouter.post('/register', registerUsers)
usersRouter.post('/login',userLogin)
usersRouter.put('/assign',assignProjects)
usersRouter.post('/complete',completeProject)
usersRouter.get('/check',verifyToken, checkUser)
usersRouter.get('/allusers',verifyToken,returnUsers)
module.exports = {
    usersRouter
}