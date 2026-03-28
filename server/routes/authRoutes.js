const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateBody');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../utils/authSchemas');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);
router.patch('/me', authMiddleware, validateBody(updateProfileSchema), authController.updateProfile);
router.patch('/me/password', authMiddleware, validateBody(changePasswordSchema), authController.changePassword);

module.exports = router;
