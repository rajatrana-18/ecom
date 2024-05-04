import fs from "fs";
import winston from "winston";
const fsPromise = fs.promises;


//#region   -------- creating a log using file system
// logging data in a text file.
// text file is also being created here only.
// async function log(logData) {
//     try {
//         logData = `\n ${new Date().toString()} - ${logData}`;
//         await fsPromise.appendFile("log.txt", logData);
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
//#endregion

// -----------------------------------------------------------------------------------

//#region  --------- creating a log using winston library
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs.txt' })
    ]
});
//#endregion


const loggerMiddleware = async (req, res, next) => {
    // 1. log request body
    if (!req.url.includes("signin")) {
        const logData = `${req.url} - ${JSON.stringify(req.body)}`;
        // await log(logData);          // this is required in case of logging data using file system 'fs'
        logger.info(logData);           // this is required in case of logging data using winston middleware.
    }
    next();
}
export default loggerMiddleware;