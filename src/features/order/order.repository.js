import { ApplicationError } from "../../error-handler/applicationError.js";
import { getClient, getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import OrderModel from "./order.model.js";

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userID) {
        const client = getClient();
        const session = client.startSession();
        try {

            const db = getDB();
            session.startTransaction();
            // 1. get cart items of user and calculate the total amount
            const items = await this.getTotalAmount(userID, session);
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0)
            console.log(finalTotalAmount);

            // 2. create a record for order
            const newOrder = new OrderModel(new ObjectId(userID), finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, { session });

            // 3. reduce the stock (producuts quantity)
            for (let item of items) {
                await db.collection("products").updateOne(
                    { _id: item.productID },
                    { $inc: { stock: -item.quantity } }, { session }
                )
            }
            // throw new Error("Something went wrong in place order")
            // 4. clear the item from the cart. 
            await db.collection("cartItems").deleteMany(
                {
                    userID: new ObjectId(userID)
                },
                { session });
            session.commitTransaction();
            session.endSession();
            return
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw new ApplicationError("Something went wrong", 500)
        }
    }

    async getTotalAmount(userID, session) {
        const db = getDB();
        const collection = db.collection("cartItems");
        const items = await collection.aggregate([
            // 1. get cart items of the user
            {
                $match: { userID: new ObjectId(userID) }
            },
            // 2. get the products from product collection.
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },

            //3. unwind the product info
            {
                $unwind: "$productInfo"
            },

            // 4. Calculate total amount for each cart item
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ],
            { session }).toArray();
        return items;
    }
}