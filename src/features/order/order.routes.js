// This file is used to manage routes/paths to the order controller.

// 1. import express 
import express from 'express';
import OrderController from './order.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. initialize express router
const orderRouter = express.Router();

const orderController = new OrderController();

orderRouter.post("/", (req, res, next) => {
    orderController.placeOrder(req, res, next)
});

export default orderRouter;