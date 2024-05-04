import { LikeRepository } from "./like.repository.js";

export default class LikeContoller {
    constructor() {
        this.likeRepository = new LikeRepository();
    }
    async likeItem(req, res, next) {
        try {
            const { id, type } = req.body;
            const userID = req.userID;

            if (type != 'Product' && type != 'Category') {
                return res.status(400).send("invalid type")
            }

            if (type == "Product") {
                this.likeRepository.likeProduct(userID, id)
            } else {
                this.likeRepository.likeCategory(userID, id)
            }
            return res.status(200).send("Like added")
        } catch (err) {
            console.log(err);
            return res.status(400).send("something went wrong")
        }
    }


    async getLikes(req, res, next) {
        try {
            const { id, type } = req.query;
            const likes = await this.likeRepository.getLikes(type, id);
            return res.status(200).send(likes)

        } catch (err) {
            console.log(err);
            return res.status(400).send("something went wrong")
        }
    }
}