import "./env.js";      // loading the env.js file to load the config of .env
import express from 'express';
import bodyParser from 'body-parser';
import swagger from "swagger-ui-express";
import cors from 'cors';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';  ----- this is for basic authorizer
import jwtAuth from './src/middlewares/jwt.middleware.js';
import apiDocs from './swagger.json' assert{type: 'json'};
import apiDocs3 from './swagger3.0.json' assert{type: 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import { connectToMongoDB } from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.routes.js";
const server = express();

//#region  to configure CORS
// CORS policy configuration using headers
// server.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5000");
//     res.header("Access-Control-Allow-Headers", "*");
//     res.header("Access-Control-Allow-Methods", "*");
//     // return OK for preflight request
//     if (req.method == "OPTIONS") {
//         return res.sendStatus(200);
//     }
//     next();
// })

// CORS policy configuration using library
var corOptions = {
    origin: "http://localhost:5000"
}
server.use(cors(corOptions));
//#endregion

// this is to inform the server that the data will be in json format.
// should be written before any route 
server.use(bodyParser.json())

// we want that all the requests related to the product should be redirected to the product routes.
// this is done so that all the requests coming from one type of module should be handled in a different route.
// server.use("/api/products", basicAuthorizer, productRouter)  ----- this is for basic authorizer
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs3))

// logger 
server.use(loggerMiddleware);

server.use("/api/orders", jwtAuth, orderRouter)
server.use("/api/products", jwtAuth, productRouter)
server.use("/api/cart", jwtAuth, cartRouter)
server.use("/api/users", userRouter)
server.use("/api/likes", jwtAuth, likeRouter)
// default request handler.
server.get("/", (req, res) => {
    res.send("Welcome to e-commerce api");
})


// error handler middleware
server.use((err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send(err.message);
    }
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }
    res.status(500).send("Something went wrong, please try again later.")       // server error
})

// Middleware to handle 404 requests. Requests that are not defined.
// suppose the user enters an api: "localhost:3200/api/info
// since, none of the above api mentioned above match with this request, it will execute the below api.
// this 404 request api has to be written at the end after specifying all other api's.
server.use((req, res) => {
    res.status(404).send('API not found. Please check our documentation for more information at <a href="http://localhost:3200/api-docs">localhost:3200/api-docs</a>');
})

server.listen(3200, () => {
    console.log("server is listening at 3200");
    connectToMongoDB();         // connect to the mongoDB server as soon as the server is started.
    connectUsingMongoose();
});
