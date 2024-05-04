import OrderRepository from "./order.repository.js";


export default class OrderController {
    constructor() {
        this.orderConstructor = new OrderRepository();
    }

    async placeOrder(req, res, next) {
        try {
            const userID = req.userID;
            await this.orderConstructor.placeOrder(userID);
            res.status(201).send("Order has been created");
        } catch (err) {
            console.log(err);
            res.status(400).send("SOmething went wrong");
        }
    }
}