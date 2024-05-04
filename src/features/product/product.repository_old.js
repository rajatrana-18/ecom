import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
class ProductRepository {
    constructor() {
        this.collection = "products";
    }
    // async add(newProduct) {
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         await collection.insertOne(newProduct);
    //         return newProduct;
    //     } catch (err) {
    //         throw new ApplicationError("Something went wrong", 500);
    //     }
    // }

    async add(newProduct) {
        try {
            // 1 . Get the db.
            const db = getDB();
            const collection = db.collection(this.collection);
            const pdt = await collection.insertOne(newProduct);
            console.log("new prooduct: " + pdt);
            return newProduct;
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

    // async rate(userID, productID, rating) {
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // find the product
    //         const product = await collection.findOne({ _id: new ObjectId(productID) });
    //         // check if the product has existing ratings
    //         const userRating = product?.ratings?.find((r) => r.userID == userID);
    //         if (userRating) {
    //             // update the rating
    //             await collection.updateOne({
    //                 // fing that particular rating using the product id and the rating attribute 
    //                 _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //             }, {
    //                 // set new rating. "$" helps to set new rating to the first found object using above expression.
    //                 $set: {
    //                     "ratings.$.rating": rating
    //                 }
    //             })
    //         } else {
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID)
    //             }, {
    //                 $push: { ratings: { userID: new ObjectId(userID), rating } }
    //             })
    //         }
    //     } catch (err) {
    //         throw new ApplicationError("Something went wrong", 500);
    //     }
    // }


    async rate(userID, productID, rating) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            // 1. remove existing entry, if it exists.
            await collection.updateOne({
                _id: new ObjectId(productID)
            }, {
                $pull: { ratings: { userID: new ObjectId(userID) } }
            })
            // 2. adds a new entry
            await collection.updateOne({
                _id: new ObjectId(productID)
            }, {
                $push: { ratings: { userID: new ObjectId(userID), rating } }
            })

        } catch (err) {
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