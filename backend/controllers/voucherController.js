const Voucher = require('../models/voucherModel');


exports.getAllVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find();
        res.status(200).json({ status: 'success', data: { vouchers } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};


exports.getVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
        res.status(200).json({ status: 'success', data: { voucher } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};


exports.createVoucher = async (req, res) => {
    try {
        const newVoucher = await Voucher.create(req.body);
        res.status(201).json({ status: 'success', data: { voucher: newVoucher } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


exports.updateVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
        res.status(200).json({ status: 'success', data: { voucher } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


exports.deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.getVoucherByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const voucher = await Voucher.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!voucher) {
            return res.status(404).json({
                status: 'fail',
                message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { voucher }
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};