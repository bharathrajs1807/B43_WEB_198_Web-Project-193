const User = require("../models/user.model.js");
const Club = require("../models/club.model.js");

const getClub = async (req, res) => {
    try {
        const clubname = req.params.clubname;
        const club = await Club.findOne({clubname}).populate("createdBy", "username");
        if(!club){
            return res.status(404).json({message: "Club not found."});
        }
        const {type, description, createdAt, createdBy} = club;
        const username = createdBy.username;
        res.status(200).json({club});
    } catch (error) {
        res.status(500).json({message: "Error getting the club."});
    }
};

const createClub = async (req, res) => {
    try {
        const {clubname, type, description, username} = req.body;
        if(!clubname || !type || !description || !username){
            return res.status(400).json({message: "clubname, type, description and username must be provided."});
        }
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const club = await Club.findOne({clubname});
        if(club){
            return res.status(400).json({message: "clubname already exists."});
        }
        const types = ["Book", "Fitness", "Technology"];
        if(!types.includes(type)){
            return res.status(400).json({message: "Club type must only be Book, Fitness and Technology."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const newClub = await Club.create({clubname, type, description, createdBy: user._id});
        res.status(201).json({message: "Successfully created a club.", club: newClub});
    } catch (error) {
        res.status(500).json({message: "Error creating the club."});
    }
};

const updateClub = async (req, res) => {
    try {
        const clubname = req.params.clubname;
        const new_clubname = req.body.clubname;
        const {type, description, username} = req.body;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const club = await Club.findOne({clubname});
        if(!club){
            return res.status(404).json({message: "Club not found."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        if(!club.createdBy.equals(user._id)){
            return res.status(401).json({message: "Not authorized to update the club details."});
        }
        if(new_clubname){
            const new_club = await Club.findOne({clubname: new_clubname});
            if(new_club){
                return res.status(400).json({message: "clubname already exists."});
            }
            club.clubname = new_clubname;
        }
        if(type){
            const types = ["Book", "Fitness", "Technology"];
            if(!types.includes(type)){
                return res.status(400).json({message: "Club type must only be Book, Fitness and Technology."});
            }
            club.type = type;
        }
        if(description){
            club.description = description;
        }
        await club.save();
        res.status(200).json({message: "Successfully updated the club."});
    } catch (error) {
        res.status(500).json({message: "Error updating the club."});
    }
};

module.exports = {getClub, createClub, updateClub};