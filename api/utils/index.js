const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { InternalServerError } = require("./errors");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);






exports.generateToken = (user)=>{
    const token = jwt.sign({...user},process.env.JWT_SECRET,{expiresIn: 86400});
    return token;
}


exports.verifyToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)

}


exports.hashIt = (password)=>{
  return bcrypt.hash(password,10)

}

exports.verifyHash = (password,hash)=>{

  return bcrypt.compare(password,hash);

}

exports.verifyAccessToken = (token)=>{
   return client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
});
}