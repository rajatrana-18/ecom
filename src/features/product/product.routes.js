// This file is used to manage routes/paths to the product controller.

// 1. import express 
import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. initialize express router
const productRouter = express.Router();

const productController = new ProductController();



// 3. specify all the paths to the controller methods.
// productRouter.get('/filter', productController.filterProduct);
// productRouter.get("/", productController.getAllProducts);
// productRouter.post("/", upload.single('imageURL'), productController.addProduct);
// productRouter.get("/:id", productController.getOneProduct);
productRouter.post('/rate', jwtAuth, (req, res, next) => {
    productController.rateProduct(req, res, next)
});

productRouter.get(
    '/filter',
    (req, res) => {
        productController.filterProduct(req, res)
    }
);

// productRouter.get(
//     '/',
//     (req, res) => {
//         productController.getAllProducts(req, res)
//     }
// );

// productRouter.post(
//     '/',
//     upload.single('imageUrl'),
//     (req, res) => {
//         productController.addProduct(req, res)
//     }
// );

// productRouter.get(
//     '/:id',
//     (req, res) => {
//         productController.getOneProduct(req, res)
//     }
// );

productRouter.get(
    '/',
    (req, res) => {
        productController.getAllProducts(req, res)
    }
);
productRouter.post(
    '/',
    upload.single('imageUrl'),
    (req, res) => {
        productController.addProduct(req, res)
    }
);

productRouter.get('/averagePrice',
    (req, res, next) => {
        productController.averagePrice(req, res, next)
    }
);

productRouter.get('/averageRating',
    (req, res, next) => {
        productController.averageRating(req, res, next)
    }
);

productRouter.get(
    '/:id',
    (req, res) => {
        productController.getOneProduct(req, res)
    }
);



export default productRouter;
// router takes a path and for that path it calls your controller method.
