const http = require("http");

const express = require("express");
const {Server} = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const connection = require("./config/db.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const User = require("./models/user.model.js");
const Profile = require("./models/profile.model.js");

const PORT = process.env.PORT;
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

const generateTokens = function(username){
    const accessToken = jwt.sign({username}, ACCESS_TOKEN_SECRET_KEY, {expiresIn: "15m"});
    const refreshToken = jwt.sign({username}, REFRESH_TOKEN_SECRET_KEY, {expiresIn: "7d"});
    return {accessToken, refreshToken};
};

app.get("/", authMiddleware, (req, res) => {
    res.status(200).json({message: "Healthy."});
});

app.post("/sign-up",  async (req, res) => {
    try {
        const {username, email, password, firstName, lastName, phoneNumber, gender} = req.body;
        if(!username || !email || !password || !firstName || !lastName || !phoneNumber || !gender){
            return res.status(400).json({message: "username, email, password, firstName, lastName, phoneNumber and gender fields must be provided."});
        }
        const existingUser = await User.findOne({$or: [{username}, {email}]});
        if(existingUser){
            return res.status(409).json({message: "username or email already exists."});
        }
        if(password.length < 8){
            return res.status(400).json({message: "Password has to be minimum 8 charaters long."});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: hashedPassword});
        if(!user){
            return res.status(500).json({message: "Error creating user."});
        }
        const profile = await Profile.create({firstName, lastName, phoneNumber, gender, userId: user._id});
        if(!profile){
            await user.remove();
            return res.status(500).json({message: "Error creating user profile."});
        }
        const {birthday, bio} = req.body;
        if(birthday){
            profile.birthday = birthday;
        }
        if(bio){
            profile.bio = bio;
        }
        await profile.save();
        res.status(201).json({message: "Successfully signed up."});
    } catch (error) {
        console.error("Error signing up.\n", error);
        res.status(500).json({message: "Internal Server Error."});
    }
});

app.post("/log-in",  async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "email and password must be provided."});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found."})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials."});
        }
        const {accessToken, refreshToken} = generateTokens(user.username);
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({message: "Successfully logged in.", accessToken, refreshToken});
    } catch (error) {
        console.error("Error logging in.\n", error);
        res.status(500).json({message: "Internal Server Error."});
    }
});

app.post("/log-out",  async (req, res) => {
    try {
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(400).json({message: "refreshToken must be provided."});
        }
        const user = await User.findOne({refreshToken});
        if(!user){
            return res.status(404).json({message: "Invalid refreshToken."});
        }
        user.refreshToken = null;
        await user.save();
        res.status(200).json({message: "Successfully logged out."});
    } catch (error) {
        console.error("Error logging out.\n", error);
        res.status(500).json({message: "Internal Server Error."});
    }
});

app.post("/refresh",  async (req, res) => {
    try {
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(400).json({message: "refreshToken must be provided."});
        }
        const user = await User.findOne({refreshToken});
        if(!user){
            return res.status(404).json({message: "Invalid refreshToken."});
        }
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
        } catch (error) {
            if(error.name==="TokenExpiredError"){
                return res.status(401).json({message: "Refresh token has expired. Please log in again."});
            }
            return res.status(401).json({message: "Invalid refresh token."});
        }
        if(decoded.username!==user.username){
            return res.status(404).json({message: "Invalid refreshToken."});
        }
        const {accessToken} = generateTokens(decoded.username);
        res.status(200).json({accessToken});
    } catch (error) {
        console.error("Error getting access token.\n", error);
        res.status(500).json({message: "Internal Server Error."});
    }
});

server.listen(PORT, async (err) => {
    if(err){
        console.error("Error connecting to the server.\n", err);
    }
    console.log("Successfully connected to the server.");
    try {
        await connection;
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Error connecting to the database.\n", err);
    }
});