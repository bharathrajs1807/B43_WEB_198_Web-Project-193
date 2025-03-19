const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: [10, "Phone number has to be at least 10 characters long."],
        maxlength: [10, "Phone number can only be 10 characters long."],
        validate: {
            validator: function(value) {
                return /^\d{10}$/.test(value);
            },
            message: "Phone number must be a valid 10-digit number."
        }
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "others"]
    },
    birthday: {
        type: Date,
        required: false
    },
    bio: {
        type: String,
        maxlength: [1000, "Bio cannot exceed 1000 characters."],
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    followings: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Post"
    },
    clubs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Club"
    }
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;