import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        } catch (err) {
            console.log(err);
            return res.status(400).send("Something went wrong");
        }
    }

    async addProduct(req, res) {
        try {
            const { name, desc, price, sizes, category } = req.body;
            const newProduct = new ProductModel(name, desc, parseFloat(price), null, category,
                sizes?.split(','));
            const createdRecord = await this.productRepository.add(newProduct);
            res.status(201).send(createdRecord)
        } catch (err) {
            console.log(err);
            return res.status(400).send("Something went wrong");
        }
    }


    async rateProduct(req, res, next) {
        try {
            console.log(req.query);
            const userID = req.userID;
            const productID = req.body.productID;
            const rating = req.body.rating;
            console.log("user id" + userID);
            // try {
            await this.productRepository.rate(userID, productID, rating);
            // } catch (err) {
            //     return res.status(err.code).send(err.message);
            //     // it will return the error user not found from rateProduct function inside product.model.js
            // }
            return res.status(200).send("Rating has been added.");
        } catch (err) {
            return res.status(400).send("Something went wrong");
            next(err);
        }
    }

    async getOneProduct(req, res) {
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if (!product) {
                res.status(404).send("Product not found");
            } else {
                res.status(200).send(product);
            }
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }

    async filterProduct(req, res) {
        try {
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const category = req.query.category;
            const result = await this.productRepository.filter(
                minPrice,
                maxPrice,
                category
            );
            res.status(200).send(result);
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }

    async averagePrice(req, res, next) {
        try {
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }

    async averageRating(req, res, next) {
        try {
            const result = await this.productRepository.getAverageRatingPerProduct();
            res.status(200).send(result);
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }
    }
}