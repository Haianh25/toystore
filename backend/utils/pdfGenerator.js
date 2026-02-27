const PDFDocument = require('pdfkit');

/**
 * Generates a luxury PDF invoice for an order.
 * @param {Object} order - The order document populated with product details.
 * @param {Object} user - The user document.
 * @param {Stream} dataStream - The writable stream to pipe PDF data to.
 */
exports.generateInvoice = (order, user, dataStream) => {
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(dataStream);

    // --- HEADER ---
    doc
        .fillColor('#000000')
        .fontSize(25)
        .font('Helvetica-Bold')
        .text('THEDEVILPLAYZ', 50, 50)
        .fontSize(10)
        .font('Helvetica')
        .text('Luxury LEGO Collectibles & Superhero Sets', 50, 80)
        .moveDown();

    doc
        .fontSize(20)
        .text('INVOICE', 50, 120, { align: 'right' })
        .fontSize(10)
        .text(`Order ID: #${order._id.toString().toUpperCase()}`, 50, 145, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 160, { align: 'right' })
        .moveDown();

    // --- CUSTOMER INFO ---
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('BILL TO:', 50, 200)
        .font('Helvetica')
        .text(user.fullName || 'Valued Collector', 50, 215)
        .text(user.email, 50, 230)
        .text(`${order.shippingAddress.street}, ${order.shippingAddress.ward}`, 50, 245)
        .text(`${order.shippingAddress.district}, ${order.shippingAddress.city}`, 50, 260);

    // --- TABLE HEADER ---
    const tableTop = 320;
    doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Item', 50, tableTop)
        .text('Qty', 280, tableTop, { width: 50, align: 'center' })
        .text('Price', 350, tableTop, { width: 100, align: 'right' })
        .text('Total', 450, tableTop, { width: 100, align: 'right' });

    doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .lineWidth(1)
        .strokeColor('#EEEEEE')
        .stroke();

    // --- ITEMS ---
    let position = tableTop + 30;
    order.products.forEach((item, index) => {
        const product = item.product;
        const name = product ? product.name : 'Unknown LEGO Set';

        doc
            .font('Helvetica')
            .fontSize(10)
            .text(name, 50, position, { width: 220 })
            .text(item.quantity.toString(), 280, position, { width: 50, align: 'center' })
            .text(item.price.toLocaleString('vi-VN') + ' VND', 350, position, { width: 100, align: 'right' })
            .text((item.price * item.quantity).toLocaleString('vi-VN') + ' VND', 450, position, { width: 100, align: 'right' });

        position += 30;

        // Draw thin line
        doc
            .moveTo(50, position - 10)
            .lineTo(550, position - 10)
            .lineWidth(0.5)
            .strokeColor('#F5F5F5')
            .stroke();
    });

    // --- SUMMARY ---
    const summaryTop = position + 20;
    doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' })
        .text((order.totalAmount + (order.discount || 0)).toLocaleString('vi-VN') + ' VND', 450, summaryTop, { width: 100, align: 'right' })

        .text('Discount:', 350, summaryTop + 20, { width: 100, align: 'right' })
        .text(`-${(order.discount || 0).toLocaleString('vi-VN')} VND`, 450, summaryTop + 20, { width: 100, align: 'right' })

        .moveDown()
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('TOTAL:', 350, summaryTop + 50, { width: 100, align: 'right' })
        .text(order.totalAmount.toLocaleString('vi-VN') + ' VND', 450, summaryTop + 50, { width: 100, align: 'right' });

    // --- FOOTER ---
    doc
        .fontSize(8)
        .fillColor('#999999')
        .text(
            'Thank you for your business. This is an official record of your collectible acquisition from TheDevilPlayz.',
            50,
            700,
            { align: 'center', width: 500 }
        );

    doc.end();
};
