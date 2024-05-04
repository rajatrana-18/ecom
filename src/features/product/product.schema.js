import mongoose from "mongoose";
const { Schema } = mongoose;

export const productSchema = new Schema({
    name: String,
    desc: String,
    price: Number,
    category: String,
    inStock: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Review'
        }
    ],
    category: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Category'
        }
    ]

})