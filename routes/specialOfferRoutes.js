const express = require('express');
const router = express.Router();
const specialOfferController = require('../controllers/specialOfferController');

router.get('/specialOffers', specialOfferController.getAllSpecialOffer);
router.post('/specialOffer', specialOfferController.createSpecialOffer);

module.exports = router;