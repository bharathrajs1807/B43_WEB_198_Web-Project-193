const express = require("express");

const {getClub, createClub, updateClub} = require("../controllers/club.controller.js");

const ClubRouter = express.Router();

ClubRouter.get("/:clubname", getClub);
ClubRouter.post("/", createClub);
ClubRouter.patch("/:clubname", updateClub);

module.exports = ClubRouter;