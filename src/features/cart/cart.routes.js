// This file is used to manage routes/paths to the cart controller.

// 1. import express 
import express from 'express';
import CartItemController from './cart.controller.js';

// 2. initialize express router
const cartRouter = express.Router();

const cartController = new CartItemController();



// 3. specify all the paths to the controller methods.
cartRouter.delete('/:id', (req, res, next) => {
    cartController.delete(req, res, next)
});
cartRouter.post('/', (req, res, next) => {
    cartController.add(req, res, next)
});
cartRouter.get('/', (req, res, next) => {
    cartController.get(req, res, next)
});

export default cartRouter;
// router takes a path and for that path it calls your controller method.
