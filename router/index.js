const Router = require('express').Router;
const userController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth-middleware');
const validatoin = require('../middleware/validation');

const router = new Router();

router.post('/users', validatoin, userController.createUser);
router.post('/login', userController.login);
router.get('/users/:id', authMiddleware, userController.getUser);
router.put('/users/:id', authMiddleware, validatoin, userController.updateUser);
router.get('/refresh', userController.refresh);

module.exports = router;
