const express = require("express");

const {getUser, updateUser, changePassword} = require("../controllers/user.controller.js");

const UserRouter = express.Router();

UserRouter.get("/:username", getUser);
UserRouter.patch("/:username", updateUser);
UserRouter.patch("/:username/change-password", changePassword);

module.exports = UserRouter;