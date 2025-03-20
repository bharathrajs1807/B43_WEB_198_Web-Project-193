const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const {getClub, createClub, updateClub} = require("../controllers/club.controller.js");

const ClubRouter = express.Router();

ClubRouter.use(authMiddleware);

ClubRouter.get("/:clubname", getClub);
ClubRouter.post("/", createClub);
ClubRouter.patch("/:clubname", updateClub);

module.exports = ClubRouter;