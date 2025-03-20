const User = require("../models/user.model.js");
const Profile = require("../models/profile.model.js");
const Club = require("../models/club.model.js");
const Post = require("../models/post.model.js");

const getPosts = async (req, res) => {
    try {
        const {username, clubname} = req.query;
        if(!username && !clubname){
            return res.status(400).json({message: "username or clubname has to be provided."});
        }
        let posts;
        if(username){
            const user = await User.findOne({username});
            if(!user){
                return res.status(404).json({message: "User not found."});
            }
            const profile = await Profile.findOne({userId: user._id});
            if(!profile){
                return res.status(404).json({message: "User profile not found."});
            }
            const profileWithPosts = await Profile.findById(profile._id).populate({
                path: "posts",
                select: "_id content likes dislikes comments createdAt createdBy",
                populate: [
                    { path: "createdBy", select: "username" },
                    { path: "comments.userId", select: "username" }
                ]
            });
            posts = profileWithPosts.posts;
        }
        else if(clubname){
            const club = await Club.findOne({clubname});
            if(!club){
                return res.status(404).json({message: "Club not found."});
            }
            const clubWithPosts = await Club.findById(club._id).populate({
                path: "posts",
                select: "_id content likes dislikes comments createdAt createdBy",
                populate: [
                    { path: "createdBy", select: "username" },
                    { path: "comments.userId", select: "username" }
                ]
            });
            posts = clubWithPosts.posts;
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: "Error getting all the posts."});
    }
};

const createPost = async (req, res) => {
    try {
        const {username, clubname} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        const {content} = req.body;
        if(!content){
            return res.status(400).json({message: "content has to be provided."});
        }
        let postCreated;
        if(username && !clubname){
            const user = await User.findOne({username});
            if(!user){
                return res.status(404).json({message: "User not found."});
            }
            const profile = await Profile.findOne({userId: user._id});
            if(!profile){
                return res.status(404).json({message: "User profile not found."});
            }
            const post = await Post.create({content, createdBy: user._id});
            postCreated = await Post.findById(post._id).populate("createdBy", "username").populate("comments.userId", "username");
            profile.posts.push(post._id);
            await profile.save();
        }
        else if(username && clubname){
            const user = await User.findOne({username});
            if(!user){
                return res.status(404).json({message: "User not found."});
            }
            const club = await Club.findOne({clubname});
            if(!club){
                return res.status(404).json({message: "Club not found."});
            }
            const post = await Post.create({content, createdBy: user._id});
            postCreated = await Post.findById(post._id).populate("createdBy", "username").populate("comments.userId", "username");
            club.posts.push(post._id);
            await club.save();
        }
        else{
            return res.status(400).json({message: "For personal post username has to be provided. And for club post username and clubname has to be provided."});
        }
        const post = {
            content: postCreated.content,
            likes: postCreated.likes.length,
            dislikes: postCreated.dislikes.length,
            comments: postCreated.comments,
            createdAt: postCreated.createdAt,
            createdBy: postCreated.createdBy
        };
        res.status(201).json({message: "Post successfully created.", post});
    } catch (error) {
        res.status(500).json({message: "Error creating the post."});
    }
};

const updatePost = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        if(!postId || !username){
            return res.status(400).json({message: "postId and username has to be provided."});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const club = await Club.findOne({posts: post._id});
        if(post.createdBy.equals(user._id) || (club && club.createdBy.equals(user._id))){
            const {content} = req.body;
            if(!content){
                return res.status(400).json({message: "content has to be provided."});
            }
            const updatedPost = await Post.findByIdAndUpdate(postId, {content}, {new: true});
            res.status(200).json({message: "Post successfully updated."});
        }
        else{
            return res.status(403).json({message: "You are not authorized to update this post."});
        }
    } catch (error) {
        res.status(500).json({message: "Error updating the post."});
    }
};

const deletePost = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        if(!postId || !username){
            return res.status(400).json({message: "postId and username has to be provided."});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found."});
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const club = await Club.findOne({posts: post._id});
        if(post.createdBy.equals(user._id) || (club && club.createdBy.equals(user._id))){
            if(!club){
                user.posts = user.posts.filter((id) => !id.equals(post._id));
                await user.save();
            }
            else{
                club.posts = club.posts.filter((id) => !id.equals(post._id));
                await club.save();
            }
            await Post.deleteOne({_id: post._id});
            res.status(200).json({message: "Post successfully deleted."});
        }
        else{
            return res.status(403).json({message: "You are not authorized to delete this post."});
        }
    } catch (error) {
        res.status(500).json({message: "Error deleting the post."});
    }
};

const updateLikes = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        if(!postId || !username){
            return res.status(400).json({message: "postId and username must be provided."});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found."});
        }
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const alreadyLiked = post.likes.some(id => id.equals(user._id));
        if(alreadyLiked){
            post.likes = post.likes.filter((id) => !id.equals(user._id));
        }
        else{
            post.likes.push(user._id);
        }
        await post.save();
        const likes = post.likes.length;
        res.status(200).json({message: "Likes successfully updated.", likes});
    } catch (error) {
        res.status(500).json({message: "Error updating likes."});
    }
};

const updateDislikes = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        if(!postId || !username){
            return res.status(400).json({message: "postId and username must be provided."});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found."});
        }
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const alreadyDisliked = post.dislikes.some(id => id.equals(user._id));
        if(alreadyDisliked){
            post.dislikes = post.dislikes.filter((id) => !id.equals(user._id));
        }
        else{
            post.dislikes.push(user._id);
        }
        await post.save();
        const dislikes = post.dislikes.length;
        res.status(200).json({message: "Dislikes successfully updated.", dislikes});
    } catch (error) {
        res.status(500).json({message: "Error updating dislikes."});
    }
};

const addComment = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        if(!postId || !username){
            return res.status(400).json({message: "postId and username must be provided."});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found."});
        }
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const {comment} = req.body;
        if(!comment){
            return res.status(400).json({message: "comment must be provided."});
        }
        post.comments.push({userId: user._id, comment});
        await post.save();
        res.status(200).json({message: "Comment successfully added."});
    } catch (error) {
        res.status(500).json({message: "Error adding the comment."});
    }
};

const deleteComment = async (req, res) => {
    try {
        const {postId} = req.params;
        const {username} = req.query;
        if(username!==req.user){
            return res.status(404).json({message: "Not authorized."});
        }
        if(!postId || !username){
            return res.status(400).json({message: "postId and username must be provided."});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found."});
        }
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const {comment} = req.body;
        if(!comment){
            return res.status(400).json({message: "comment must be provided."});
        }
        post.comments = post.comments.filter((c) => !(c.userId.equals(user._id) && c.comment===comment));
        await post.save();
        res.status(200).json({message: "Comment successfully deleted."});
    } catch (error) {
        res.status(500).json({message: "Error deleting the comment."});
    }
};

module.exports = {getPosts, createPost, updatePost, deletePost, updateLikes, updateDislikes, addComment, deleteComment};