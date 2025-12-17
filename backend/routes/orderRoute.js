import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { confirmPayment, createOrder, deleteOrder, getOrderById, getOrders, updateOrder, generateInvoice } from '../controllers/orderController.js';

const orderRouter = express.Router();

// protected routes
orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/confirm', authMiddleware, confirmPayment);

// invoice routes
orderRouter.get("/:id/invoice", authMiddleware, generateInvoice);

// public routes
orderRouter.get('/', getOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);
orderRouter.delete('/:id', deleteOrder);

export default orderRouter;
