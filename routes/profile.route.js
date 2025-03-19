const express = require("express");

const {getProfile, updateProfile, addFollowing, removeFollowing, addClub, removeClub} = require("../controllers/profile.controller.js");

const ProfileRouter = express.Router();

ProfileRouter.get("/:username", getProfile);
ProfileRouter.patch("/:username", updateProfile);
ProfileRouter.patch("/:username/add-following", addClub);
ProfileRouter.patch("/:username/remove-following", removeClub);
ProfileRouter.patch("/:username/add-club", addClub);
ProfileRouter.patch("/:username/remove-club", removeClub);

module.exports = ProfileRouter;