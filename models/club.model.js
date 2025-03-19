const mongoose = require("mongoose");

const ClubSchema = mongoose.Schema({
    clubname: {
        type: String,
        minlength: [3, "Club name has to be minimum 3 characters long."],
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["Book", "Fitness", "Technology"],
        required: true
    },
    description: {
        type: String,
        maxlength: [1000, "Bio cannot exceed 1000 characters."],
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post"
    }
});

const Club = mongoose.model("Club", ClubSchema);

module.exports = Club;