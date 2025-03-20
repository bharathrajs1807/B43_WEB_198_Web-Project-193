const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const {getPosts, createPost, updatePost, deletePost, updateLikes, updateDislikes, addComment, deleteComment} = require("../controllers/post.controller.js");

const PostRouter = express.Router();

PostRouter.use(authMiddleware);

PostRouter.get("/", getPosts);
PostRouter.post("/", createPost);
PostRouter.patch("/:postId", updatePost);
PostRouter.delete("/:postId", deletePost);
PostRouter.patch("/:postId/update-likes", updateLikes);
PostRouter.patch("/:postId/update-dislikes", updateDislikes);
PostRouter.patch("/:postId/add-comment", addComment);
PostRouter.patch("/:postId/delete-comment", deleteComment);


module.exports = PostRouter;