const express = require('express')

const ctrl = require('../../controllers/auth');

const { registerSchema, loginSchema } = require('../../models/auth');
const { authenticate, isValidateBody, upload } = require('../../middlewares')

const router = express.Router();

router.post('/register', isValidateBody(registerSchema), ctrl.register)
router.post('/login', isValidateBody(loginSchema),ctrl.login)
router.get('/current', authenticate, ctrl.current)
router.patch('/users', authenticate, ctrl.updateSub)
router.patch('/users/avatars', authenticate, upload.single ("avatar"), ctrl.updAvatar)

module.exports = router;