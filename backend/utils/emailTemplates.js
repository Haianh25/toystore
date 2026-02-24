const getOrderConfirmationTemplate = (order, user) => {
    const productsHtml = order.products.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.product.name}</strong><br>
                <small>Số lượng: ${item.quantity}</small>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ${item.price.toLocaleString('vi-VN')} VND
            </td>
        </tr>
    `).join('');

    return `
    <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: auto; border: 1px solid #000; padding: 40px; color: #000;">
        <h1 style="text-align: center; letter-spacing: 0.2em; border-bottom: 2px solid #000; padding-bottom: 20px;">THEDEVILPLAYZ</h1>
        <p>Xin chào <strong>${user.fullName || 'Quý khách'}</strong>,</p>
        <p>Cảm ơn bạn đã đặt hàng tại TheDevilPlayz. Chúng tôi đã nhận được đơn hàng của bạn và đang tiến hành xử lý.</p>
        
        <div style="margin: 30px 0; border: 1px solid #eee; padding: 20px; background: #f9f9f9;">
            <h3 style="margin-top: 0; border-bottom: 1px solid #000; display: inline-block;">ĐƠN HÀNG #${order._id.toString().slice(-6).toUpperCase()}</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                ${productsHtml}
                <tr>
                    <td style="padding: 20px 10px 10px; text-align: right;"><strong>Tạm tính:</strong></td>
                    <td style="padding: 20px 10px 10px; text-align: right;">${(order.totalAmount + (order.discount || 0)).toLocaleString('vi-VN')} VND</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                    <td style="padding: 5px 10px; text-align: right; color: #e74c3c;"><strong>Giảm giá:</strong></td>
                    <td style="padding: 5px 10px; text-align: right; color: #e74c3c;">-${order.discount.toLocaleString('vi-VN')} VND</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 10px; text-align: right; font-size: 1.2em;"><strong>TỔNG CỘNG:</strong></td>
                    <td style="padding: 10px; text-align: right; font-size: 1.2em; border-top: 2px solid #000;"><strong>${order.totalAmount.toLocaleString('vi-VN')} VND</strong></td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 30px;">
            <h4 style="border-bottom: 1px solid #000; display: inline-block;">ĐỊA CHỈ GIAO HÀNG</h4>
            <p style="margin: 5px 0;">${order.shippingAddress.fullName}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.phone}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.street}, ${order.shippingAddress.ward}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
        </div>

        <p style="text-align: center; margin-top: 40px; font-style: italic; color: #666;">
            Trân trọng,<br>
            TheDevilPlayz Team
        </p>
    </div>
    `;
};

module.exports = {
    getOrderConfirmationTemplate
};
