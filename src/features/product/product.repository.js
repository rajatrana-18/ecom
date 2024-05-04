import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import UserModel from "../user/user.model.js";
import mongoose from "mongoose";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product', productSchema)
const ReviewModel = mongoose.model('Review', reviewSchema)
const CategoryModel = mongoose.model('Category', categorySchema)

class ProductRepository {
    constructor() {
        this.collection = "products";
    }

    async add(productData) {
        try {
            // 1. add the new product
            productData.category = productData.category.split(",").map(e => e.trim());
            console.log(productData)
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();

            // 2. update categories
            await CategoryModel.updateMany(
                { _id: { $in: productData.category } },
                {
                    $push: { products: new ObjectId(savedProduct._id) }
                }
            )
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getAll() {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find().toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async get(id) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (err) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async filter(minPrice, maxPrice, category) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {}
            if (minPrice) {
                filterExpression.price = { $gte: parseFloat(minPrice) };        //filtering price will be greater than or equal to the provided price.
            }
            if (maxPrice) {
                filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice) };        //filtering price will be less than or equal to the provided price.
                // ... is used when you want to extend something to the current expression as well.
                // otherwise, the second if will overwrite the first if condition. but here we want to append the conditions. 
            }
            if (category) {
                filterExpression.category = category;
            }
            // return collection.find(filterExpression).toArray(); 
            return collection.find(filterExpression).project({ _id: 0, name: 1, price: 1, sizes: 1 }).toArray();
        } catch (err) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }


    async rate(userID, productID, rating) {
        try {
            // 1. check if the product exists
            const productToUpdate = await ProductModel.findById(productID);
            if (!productToUpdate) {
                throw new Error("Product not found");
            }

            // 2. get the existing review
            const userReview = await ReviewModel.findOne({ product: new ObjectId(productID), userID: new ObjectId(userID) });
            if (userReview) {
                userReview.rating = rating;
                await userReview.save();
            } else {
                const newReview = new ReviewModel({
                    product: new ObjectId(productID),
                    userID: new ObjectId(userID),
                    rating: rating
                })
                newReview.save();
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async averageProductPricePerCategory() {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.aggregate([
                {
                    // stage 1. get average price per category

                    // these are the new field names that are to be created in the db since this  collection is not present there.
                    $group: {
                        _id: "$category",
                        averagePrice: { $avg: "$price" }
                    }

                }]).toArray();
            return result;
        } catch (err) {
            throw new ApplicationError("SOmething went wrong", 500);
        }
    }

    async getAverageRatingPerProduct() {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            console.log(collection);
            const result = await collection.aggregate([
                { $unwind: "$ratings" }
                ,
                {
                    $group: {
                        _id: "$name",
                        averageRating: { $avg: "$ratings.rating" }
                    }
                }
            ]).toArray();
            return result;
        } catch (err) {
            throw new ApplicationError("SOmething went wrong", 500);
        }
    }
}

export default ProductRepository;