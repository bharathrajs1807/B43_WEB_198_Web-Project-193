const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

const authMiddleware = function(req, res, next){
    const tokenWithBearer = req.headers["authorization"];
    if(!tokenWithBearer){
        return res.status(400).json({message: "No authorization token provided."});
    }
    if(!tokenWithBearer.startsWith("Bearer ")){
        return res.status(400).json({message: "Token format is incorrect. Use Bearer <token>."});
    }
    try {
        const token = tokenWithBearer.replace("Bearer ", "");
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({message: "Invalid token."});
        }
        req.user = decoded.username;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired token."});
    }
};

module.exports = authMiddleware;