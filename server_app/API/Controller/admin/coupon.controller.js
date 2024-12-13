const Coupons = require('../../../Models/coupon')

module.exports = {
    index: async (req, res) => {
        try {
            const coupons = await Coupons.find()
            res.json(coupons)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    detail: async (req, res) => {
        try {
            const coupon = await Coupons.findById(req.params.id)
            if (!coupon) return res.status(404).json({ msg: "Không tìm thấy coupon" })
            res.json(coupon)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const newCoupon = new Coupons(req.body)
            await newCoupon.save()
            res.json({ msg: "Tạo coupon thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    update: async (req, res) => {
        try {
            await Coupons.findByIdAndUpdate(req.params.id, req.body)
            res.json({ msg: "Cập nhật coupon thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    delete: async (req, res) => {
        try {
            await Coupons.findByIdAndDelete(req.params.id)
            res.json({ msg: "Xóa coupon thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    checking: async (req, res) => {
        try {
            const coupon = await Coupons.findOne({ code: req.query.code })
            if (!coupon) return res.status(404).json({ msg: "Mã không hợp lệ" })
            res.json(coupon)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    createCoupon: async (req, res) => {
        try {
            const coupon = await Coupons.findById(req.params.id)
            if (!coupon) return res.status(404).json({ msg: "Không tìm thấy coupon" })
            
            coupon.count += 1
            await coupon.save()
            
            res.json({ msg: "Sử dụng coupon thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}