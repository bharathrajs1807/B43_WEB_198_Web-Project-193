const bcrypt = require("bcryptjs");

const User = require("../models/user.model.js");

const getUser = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        res.status(200).json({username: user.username, email: user.email});
    } catch (error) {
        res.status(500).json({message: "Error getting the user."});
    }
};

const updateUser = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const new_username = req.body.username;
        const new_email = req.body.email;
        if(new_username){
            const new_user = await User.findOne({username: new_username});
            if(new_user){
                return res.status(400).json({message: "Username already exists."});
            }
            user.username = new_username;
        }
        if(new_email){
            const new_user = await User.findOne({email: new_email});
            if(new_user){
                return res.status(400).json({message: "Email already exists."});
            }
            user.email = new_email;
        }
        await user.save();
        res.status(200).json({message: "Successfully updated the user."});
    } catch (error) {
        res.status(500).json({message: "Error updating the user."});
    }
};

const changePassword = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const {password, new_password} = req.body;
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials."});
        }
        if(new_password.length < 8){
            return res.status(400).json({message: "Password has to be minimum 8 charaters long."});
        }       
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message: "Successfully changed the password."});
    } catch (error) {
        res.status(500).json({message: "Error changing the password."});
    }
};

module.exports = {getUser, updateUser, changePassword};