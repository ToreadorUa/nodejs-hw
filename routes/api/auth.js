const express = require('express')

const ctrl = require('../../controllers/auth');
const authenticate = require('../../middlewares/authenticate');
const isValidateBody = require('../../middlewares/isValidateBody');
const { registerSchema, loginSchema } = require('../../models/auth');

const router = express.Router();

router.post('/register', isValidateBody(registerSchema), ctrl.register)
router.post('/login', isValidateBody(loginSchema),ctrl.login)
router.get('/current', authenticate, ctrl.current)
router.patch('/users',authenticate,ctrl.updateSub)

module.exports = router;