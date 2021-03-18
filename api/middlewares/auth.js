const { BadRequest, InternalServerError, Unauthorized } = require("../utils/errors");
const pool = require("../../config/db");
const { getConn, getOne } = require("../../db");
const { verifyToken } = require("../utils");

const authMiddleware = async (req, res,next ) => {
    try {
        const connection = await getConn(pool);
        try {
            if (!req.headers["authorization"]) 
                throw new Unauthorized("PLEASE LOGIN! NO AUTH TOKEN");
            
            const token = req.headers["authorization"].replace("Bearer ","");
            const user = verifyToken(token);
            const searchedUser = await getOne(connection, {
                fields: `userId, email, avatar, name, emailVerified`,
                tables: `users`,
                conditions: `userId=?`,
                values: [user.userId],
            });
         
            if(!searchedUser.length) throw new Unauthorized("USER DOESN'T EXIST! PLEASE REGISTER");
            if(!searchedUser[0].emailVerified) throw new Unauthorized("USER'S EMAIL IS NOT VERIFIED!")

            req.user = searchedUser[0];

            next()

        } finally {
            pool.releaseConnection(connection)
        }
    } catch (e) {
        console.log(e)
        //check for more errors that we didnt list!
        if(e.status){
            res.status(e.status).json({
                error:e.toString()
            })
        }else{
        
            res.status(500).json({
                error:e.toString()
            })
        }
    }
};

module.exports = authMiddleware;