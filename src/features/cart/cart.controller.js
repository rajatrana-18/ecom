
import CartItemModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";
export default class CartItemController {
    constructor() {
        this.cartRepository = new CartRepository();
    }
    async add(req, res) {
        try {
            const { productID, quantity } = req.body;
            const userID = req.userID;
            await this.cartRepository.add(productID, userID, quantity);
            res.status(201).send("Item is added to the cart");
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }

    async get(req, res) {
        try {
            console.log(req.body)
            const userID = req.userID;
            console.log(`the user id is ${userID}`);
            const items = await this.cartRepository.get(userID);
            return res.status(200).send(items);
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }

    async delete(req, res) {
        try {
            const userID = req.userID;
            const cartItemID = req.params.id;
            console.log(userID + "   " + cartItemID)
            const isDeleted = await this.cartRepository.delete(cartItemID, userID);
            if (!isDeleted) {
                return res.status(404).send("Item not found");
            }
            return res.status(200).send("item deleted");
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }
}