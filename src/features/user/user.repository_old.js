import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
class UserRepository {
    async signUp(newUser) {
        try {
            // 1. get the database
            const db = getDB();
            // 2. get the collection
            const collection = db.collection("users");
            // 3. insert the document
            await collection.insertOne(newUser);
            return newUser;
        } catch (err) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async signIn(email, password) {
        try {
            // 1. get the database
            const db = getDB();
            // 2. get the collection
            const collection = db.collection("users");
            // 3. insert the document
            return await collection.findOne({ email, password });
        } catch (err) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async findByEmail(email) {
        try {
            // 1. get the database
            const db = getDB();
            // 2. get the collection
            const collection = db.collection("users");
            // 3. insert the document
            return await collection.findOne({ email });
        } catch (err) {
            throw new ApplicationError("Something went wrong", 500);
        }
    }
}

export default UserRepository;