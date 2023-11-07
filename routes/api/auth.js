const express = require('express')

const ctrl = require('../../controllers/auth');

const { registerSchema, loginSchema,emailSchema } = require('../../models/auth');
const { authenticate, isValidateBody, upload } = require('../../middlewares')

const router = express.Router();

router.post('/register', isValidateBody(registerSchema), ctrl.register)
router.post('/login', isValidateBody(loginSchema),ctrl.login)
router.get('/current', authenticate, ctrl.current)
router.patch('/users', authenticate, ctrl.updateSub)
router.patch('/users/avatars', authenticate, upload.single("avatar"), ctrl.updAvatar)
router.get('/verify/:verifyCode', ctrl.verifySubmit)
router.post('/verify', isValidateBody(emailSchema), ctrl.resendEmail)

module.exports = router;