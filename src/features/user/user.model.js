import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
    constructor(name, email, password, type, id) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this._id = id;
    }

    // static async signUp(name, email, password, type) {
    //     try {
    //         // 1. get the database
    //         const db = getDB();
    //         // 2. get the collection
    //         const collection = db.collection("users");
    //         const newUser = new UserModel(name, email, password, type);

    //         // 3. insert the document
    //         await collection.insertOne(newUser);
    //         return newUser;
    //     } catch (err) {
    //         throw new ApplicationError("Something went wrong", 500);
    //     }
    // }

    // static signIn(email, password) {
    //     const user = users.find((u) => u.email == email && u.password == password);
    //     return user;
    // }

    static getAll() {
        return users;
    }
}

let users = [
    {
        id: 1,
        name: 'Rajat Rana',
        email: 'rajatrana.000018@gmail.com',
        password: 'pass1234',
        type: 'seller'
    },

    {
        id: 2,
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'pass1234',
        type: 'customer'
    }
]