import mongoose from "mongoose"
import { LikeSchema } from "./like.schema.js"
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

const likeModel = mongoose.model('Like', LikeSchema)
export class LikeRepository {

    async getLikes(type, id) {
        return await likeModel.find({
            likeable: new ObjectId(id),
            types: type
        }).populate('user').populate({ path: 'likeable', model: type })
    }

    async likeProduct(userID, productID) {
        try {
            const newLike = new likeModel({
                user: new ObjectId(userID),
                likeable: new ObjectId(productID),
                types: 'Product'
            })
            await newLike.save();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong", 500)
        }
    }


    async likeCategory(userID, categoryID) {
        try {
            const newLike = new likeModel({
                user: new ObjectId(userID),
                likeable: new ObjectId(categoryID),
                types: 'Category'
            })
            await newLike.save();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong", 500)
        }
    }
}