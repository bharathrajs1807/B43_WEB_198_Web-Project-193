const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const {getProfile, updateProfile, addFollowing, removeFollowing, addClub, removeClub} = require("../controllers/profile.controller.js");

const ProfileRouter = express.Router();

ProfileRouter.use(authMiddleware);

ProfileRouter.get("/:username", getProfile);
ProfileRouter.patch("/:username", updateProfile);
ProfileRouter.patch("/:username/add-following", addFollowing);
ProfileRouter.patch("/:username/remove-following", removeFollowing);
ProfileRouter.patch("/:username/add-club", addClub);
ProfileRouter.patch("/:username/remove-club", removeClub);

module.exports = ProfileRouter;