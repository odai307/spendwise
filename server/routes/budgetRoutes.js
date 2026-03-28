const express = require('express');
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateBody');
const { upsertBudgetSchema } = require('../utils/budgetSchemas');

const router = express.Router();

router.use(authMiddleware);
router.get('/', budgetController.getCurrent);
router.post('/', validateBody(upsertBudgetSchema), budgetController.upsert);
router.get('/status', budgetController.status);

module.exports = router;
