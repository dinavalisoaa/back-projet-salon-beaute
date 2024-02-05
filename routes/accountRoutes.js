const express = require('express');
const router = express.Router();
const songController = require('../controllers/accountController');

router.get('/accounts', songController.getAllAccount);
router.get('/account/state', songController.getState);
router.post('/account', songController.createAccount);
router.get('/account/:id', songController.getAccount);
router.put('/account/:id', songController.updateAccount);
router.delete('/account/:id', songController.deleteAccount);



module.exports = router;