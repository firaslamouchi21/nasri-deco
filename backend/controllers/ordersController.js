const ordersModel = require('../models/ordersModel');

async function submitOrder(req, res) {
  try {
    // Log for debugging
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const { name, email, phone, details } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !email || !phone || !details || !image) {
      return res.status(400).json({ error: 'All fields and image are required.' });
    }

    const order = { name, email, phone, details, image };
    const orderId = await ordersModel.createOrder(order);

    res.status(201).json({ message: "Order saved successfully", orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit order', details: error.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await ordersModel.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders', details: error.message });
  }
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'confirmed', 'delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  try {
    const affected = await ordersModel.updateOrderStatus(id, status);
    if (affected) {
      res.json({ message: 'Order status updated' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
}

module.exports = { submitOrder, getAllOrders, updateOrderStatus }; 