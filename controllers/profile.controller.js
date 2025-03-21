const User = require("../models/user.model.js");
const Profile = require("../models/profile.model.js");
const Club = require("../models/club.model.js");

const getProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const profile = await Profile.findOne({userId: user._id})
        .populate("followings", "username -_id")
        .populate("clubs", "clubname -_id");
        if(!profile){
            return res.status(404).json({message: "Profile not found."});
        }
        const {firstName, lastName, phoneNumber, gender, birthday, bio} = profile;
        const followings = profile.followings;
        const clubs = profile.clubs;
        res.status(200).json({firstName, lastName, phoneNumber, gender, birthday, bio, followings, clubs});
    } catch (error) {
        res.status(500).json({message: "Error getting the profile."});
    }
};

const updateProfile = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const profile = await Profile.findOne({userId: user._id});
        if(!profile){
            return res.status(404).json({message: "Profile not found."});
        } 
        await Profile.updateOne({_id: profile._id}, {$set: {...req.body}});
        res.status(200).json({message: "Profile successfully updated."});
    } catch (error) {
        res.status(500).json({message: "Error updating the profile."});
    }
};

const addFollowing = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const profile = await Profile.findOne({userId: user._id});
        if(!profile){
            return res.status(404).json({message: "Profile not found."});
        }
        const other_username = req.body.username;
        const other_user = await User.findOne({username: other_username});
        if(!other_user){
            return res.status(404).json({message: "Other user not found."});
        }
        const alreadyFollowing = profile.followings.some(id => id.equals(other_user._id));
        if(alreadyFollowing) {
            return res.status(400).json({message: "You are already following this user."});
        }
        profile.followings.push(other_user._id);
        await profile.save();
        res.status(200).json({message: "Successfully followed the other user."});
    } catch (error) {
        res.status(500).json({message: "Error following the other user."});
    }
};

const removeFollowing = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const profile = await Profile.findOne({userId: user._id});
        if(!profile){
            return res.status(404).json({message: "Profile not found."});
        }
        const other_username = req.body.username;
        const other_user = await User.findOne({username: other_username});
        if(!other_user){
            return res.status(404).json({message: "Other user not found."});
        }
        const alreadyFollowing = profile.followings.some(id => id.equals(other_user._id));
        if(!alreadyFollowing) {
            return res.status(400).json({message: "You are not following this user."});
        }
        profile.followings = profile.followings.filter((id) => !id.equals(other_user._id));
        await profile.save();
        res.status(200).json({message: "Successfully unfollowed the other user."});
    } catch (error) {
        res.status(500).json({message: "Error unfollowing the other user."});
    }
};

const addClub = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const profile = await Profile.findOne({userId: user._id});
        if(!profile){
            return res.status(404).json({message: "Profile not found."});
        }
        const clubname = req.body.clubname;
        const club = await Club.findOne({clubname});
        if(!club){
            return res.status(404).json({message: "Club not found."});
        }
        const alreadyInTheClub = profile.clubs.some(id => id.equals(club._id));
        if(alreadyInTheClub) {
            return res.status(400).json({message: "You are already in this club."});
        }
        profile.clubs.push(club._id);
        await profile.save();
        res.status(200).json({message: "Successfully joinied the club."});
    } catch (error) {
        res.status(500).json({message: "Error joining the club."});
    }
};

const removeClub = async (req, res) => {
    try {
        const username = req.params.username;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const profile = await Profile.findOne({userId: user._id});
        if(!profile){
            return res.status(404).json({message: "Profile not found."});
        }
        const clubname = req.body.clubname;
        const club = await Club.findOne({clubname});
        if(!club){
            return res.status(404).json({message: "Club not found."});
        }
        const alreadyInTheClub = profile.clubs.some(id => id.equals(club._id));
        if(!alreadyInTheClub){
            return res.status(400).json({message: "You are not in this club."});
        }
        profile.clubs = profile.clubs.filter((id) => !id.equals(club._id));
        await profile.save();
        res.status(200).json({message: "Successfully left the club."});
    } catch (error) {
        res.status(500).json({message: "Error leaving the club."});
    }
};

module.exports = {getProfile, updateProfile, addFollowing, removeFollowing, addClub, removeClub};