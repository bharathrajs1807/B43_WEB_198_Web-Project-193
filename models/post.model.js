const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    content: {
        type: String,
        maxlength: [1000, "Caption cannot exceed 1000 characters."],
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;