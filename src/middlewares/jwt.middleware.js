import jwt from 'jsonwebtoken';
const jwtAuth = (req, res, next) => {
    //1. read token
    console.log(req.headers)
    const token = req.headers['authorization'];

    //2. if no token, return the error.
    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    //3. check if token is valid.
    try {
        const payload = jwt.verify(token, "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz");
        req.userID = payload.userID;
        console.log(payload);
    }
    catch (err) {

        //4. return error.
        return res.status(401).send("Unauthorized");
    }

    //5.  call next middleware.
    next();
}

export default jwtAuth;

// AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz,     nXkwCaOGEj