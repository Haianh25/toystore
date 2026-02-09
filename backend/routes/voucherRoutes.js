const express = require('express');
const voucherController = require('../controllers/voucherController');

const router = express.Router();

router.route('/')
    .get(voucherController.getAllVouchers)
    .post(voucherController.createVoucher);

router.route('/:id')
    .get(voucherController.getVoucher)
    .patch(voucherController.updateVoucher)
    .delete(voucherController.deleteVoucher);

router.get('/code/:code', voucherController.getVoucherByCode);

module.exports = router;