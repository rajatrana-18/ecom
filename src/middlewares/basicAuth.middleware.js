import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
    // check if the authorization header is empty.
    const authHeader = req.headers["authorization"];   // headers is an array
    if (!authHeader) {
        return res.status(401).send("No authorization details found");
    }

    console.log(authHeader);            // [Basic cmFqYXRyYW5hLjAwMDAxOEBnbWFpbC5jb206cGFzczEyMzQ=]

    // extract credentials.
    // the credentails will be in this format - [Basic dhfikanfeidmlkgpqirhfigfdsgfhf]
    // they are encoded in base64

    const base64Credentials = authHeader.replace('Basic ', '');
    console.log(base64Credentials);     // [cmFqYXRyYW5hLjAwMDAxOEBnbWFpbC5jb206cGFzczEyMzQ=]

    // decoding the credentials
    const decodeCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    console.log(decodeCredentials);     // this will be in this format : [rajatrana.000018@gmail.com:pass1234]

    // separate in into an array of username and password
    const creds = decodeCredentials.split(':');

    // check if the user exists
    const user = UserModel.getAll().find((u) => u.email == creds[0] && u.password == creds[1]);
    if (user) {
        next();
    } else {
        return res.status(401).send("Invalid credentials");
    }

}

export default basicAuthorizer;



