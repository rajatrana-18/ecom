// This file is used to manage routes/paths to the user controller.

// 1. import express 
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. initialize express router
const userRouter = express.Router();

const userController = new UserController();



// 3. specify all the paths to the controller methods.
// productRouter.get('/filter', productController.filterProduct);
// productRouter.get("/", productController.getAllProducts);
// productRouter.post("/", upload.single('imageURL'), productController.addProduct);
// productRouter.get("/:id", productController.getOneProduct);

userRouter.post('/signup', (req, res, next) => {
    userController.signUp(req, res, next)
});

userRouter.post('/signin', (req, res) => {
    userController.signIn(req, res)
});

userRouter.put('/resetPassword', jwtAuth, (req, res) => {
    userController.resetPassword(req, res)
})




export default userRouter;
// router takes a path and for that path it calls your controller method.
