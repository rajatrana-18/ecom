import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }
    async signUp(req, res, next) {
        try {
            const { name, email, password, type } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new UserModel(name, email, hashedPassword, type);
            await this.userRepository.signUp(user);
            res.status(201).send(user)
        } catch (err) {
            next(err);
            console.log(err);
            // return res.status(400).send("Something went wrong");
        }
    }

    async signIn(req, res, next) {
        try {
            const user = await this.userRepository.findByEmail(req.body.email);
            if (!user) {
                return res.status(400).send("invalid credentials");
            } else {
                // compare password with hashed passsword
                const result = await bcrypt.compare(req.body.password, user.password);
                if (result) {

                    // 1. create a token
                    const token = jwt.sign({ userID: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                    req.userID = user._id;
                    // 2. send token to the client
                    return res.status(200).send(token);
                } else {
                    return res.status(400).send("incorrect credentials");
                }
            }

        } catch (err) {
            next(err);
            console.log(err);
            return res.status(400).send("Something went wrong");
        }
    }


    async resetPassword(req, res, next) {
        const { newPassword } = req.body;
        const userID = req.userID;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        try {
            await this.userRepository.resetPassword(userID, hashedPassword);
            res.status(200).send("Password is reset")
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

    }
}