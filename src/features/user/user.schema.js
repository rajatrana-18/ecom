// add all those attributes that are there in the model except the id

import mongoose from "mongoose";
const { Schema } = mongoose;

export const userSchema = new Schema({
    name: { type: String, maxLength: [25, "Name can't be greater than 25 characters"] },
    email: {
        type: String, unique: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password: {
        type: String,
        // validate: {
        //     validator: function (value) {
        //         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        //     },
        //     message: "Password should be between 8 to 12 characters and have a special character."
        // }
    },
    type: { type: String, enum: ['Customer', 'Seller'] }
})