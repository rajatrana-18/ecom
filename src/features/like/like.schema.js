// likeable contains likes from a particular user. these likes can be on the product or the category. 
// that is why we have used refPath since we dont know where the like is coming from.
// refPath : 'types' where types is a variable which can have either Product or Category


import mongoose, { mongo } from "mongoose";
export const LikeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'types'
    },
    types: {
        type: String,
        enum: ['Product', 'Category']
    }
}).pre('save', (next) => {
    console.log("New like coming in")
    next();
}).post('save', (doc) => {
    console.log("Like is saved")
    console.log(doc);
})