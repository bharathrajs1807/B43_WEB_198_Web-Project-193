const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const {getUser, updateUser, changePassword} = require("../controllers/user.controller.js");

const UserRouter = express.Router();

UserRouter.use(authMiddleware);

UserRouter.get("/:username", getUser);
UserRouter.patch("/:username", updateUser);
UserRouter.patch("/:username/change-password", changePassword);

module.exports = UserRouter;