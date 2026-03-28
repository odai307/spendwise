const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateBody');
const { createTransactionSchema, updateTransactionSchema } = require('../utils/transactionSchemas');

const router = express.Router();

router.use(authMiddleware);
router.get('/categories', transactionController.categories);
router.get('/summary', transactionController.summary);
router.get('/', transactionController.list);
router.get('/:id', transactionController.getById);
router.post('/', validateBody(createTransactionSchema), transactionController.create);
router.put('/:id', validateBody(updateTransactionSchema), transactionController.update);
router.delete('/:id', transactionController.remove);

module.exports = router;
