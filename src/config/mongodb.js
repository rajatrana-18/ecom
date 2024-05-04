// import { MongoClient } from "mongodb";
// let client;
// export const connectToMongoDB = () => {
//     MongoClient.connect(process.env.DB_URL)
//         .then(clientInstace => {
//             client = clientInstace;
//             console.log("MongoDB is connected");
//             createCounter(client.db());
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }

// export const getDB = () => {
//     return client.db();
// }


// const createCounter = async (db) => {
//     const existingCounter = await db.collection("counters").findOne({ _id: 'cartItemId' });
//     if (!existingCounter) {
//         await db.collection("counters").insertOne({ _id: 'cartItemId', value: 0 });
//     }
// }




import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;
console.log("URL: " + url);

let client;
export const connectToMongoDB = () => {
    MongoClient.connect(url)
        .then(clientInstance => {
            client = clientInstance
            console.log("Mongodb is connected");
            createCounter(client.db());     // can be commented if you want mongodb universal id
            createIndexes(client.db());
        })
        .catch(err => {
            console.log(err);
        })
}

export const getClient = () => {
    return client;
}

export const getDB = () => {
    return client.db();
}

// can be commented if you want mongodb universal id
const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({ _id: 'cartItemId' });
    if (!existingCounter) {
        await db.collection("counters").insertOne({ _id: 'cartItemId', value: 0 });
    }
}

// creating indexes
const createIndexes = async (db) => {
    await db.collection("products").createIndex({ price: 1 });      // single field index
    await db.collection("products").createIndex({ name: 1, category: -1 });     // compound index
    await db.collection("products").createIndex({ desc: "text" });      // text based index
    console.log("indexes are created")
}
