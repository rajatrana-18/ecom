import mongoose from "mongoose";
const { Schema } = mongoose;

export const cartSchema = new Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: Number

})