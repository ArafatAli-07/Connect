import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (caption && caption.length > 500) {
      return res.status(400).json({
        message: "Caption is too long (max 500 characters)",
        success: false,
      });
    }
    if (!image) {
      return res.status(400).json({
        message: "Image required",
        success: false,
      });
    }
    if (!authorId) {
      return res.status(401).json({
        message: "Unauthorized. Author ID missing.",
        success: false,
      });
    }

    //Image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 700, height: 700, fit: "cover" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to datauri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    // console.log(error)
    console.error("Error in addNewPost:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    // console.log(error)
    console.error("Error in getAllPost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    // console.log(error)
    console.error("Error in getUserPost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const likedBy_Id = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // like logic
    await post.updateOne({ $addToSet: { likedBy_Id } });
    await post.save();

    //implement socket io for real time notification

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
    });
  } catch (error) {
    // console.log(error)
    console.error("Error in likePost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to like post",
    });
  }
};

export const disLikePost = async (req, res) => {
  try {
    const likedBy_Id = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // disLike logic
    await post.updateOne({ $pull: { likedBy_Id } });
    await post.save();

    //implement socket io for real time notification

    return res.status(200).json({
      message: "Post Disliked successfully",
      success: true,
    });
  } catch (error) {
    // console.log(error)
    console.error("Error in disLikePost:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to like dispost",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentedById = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({
        message: "Text required for comment",
        success: false,
      });
    }
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    const comment = await Comment.create({
      text,
      author: commentedById,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      message: "Add Comment successfully",
      comment,
      success: true,
    });
  } catch (error) {
    // console.log(error)
    console.error("Error in addComment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment.",
    });
  }
};

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    if (comments.length === 0) {
      return res.status(404).json({
        message: "No comment found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    // console.log(error);
    console.error("Error in getCommentOfPost:", error);
    return res.status(500).json({
      message: "Failed to fetch comments",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    //checking is login user is owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You can delete only your own post",
        success: false,
      });
    }
    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post ID form the User's posts
    let user = await User.findById(authorId);
    if (user) {
      user.posts = user.posts.filter((id) => id.toString() !== postId);
      await user.save();
    }

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    // console.log(error);
    console.error("Error in deletePost:", error);
    return res.status(500).json({
      message: "Failed to delete post",
      success: false,
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (user.bookmarks.includes(post._id)) {
      // already bookmarked ---->  remove it
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        message: "Post removed from bookmarks",
        success: true,
      });
    } else {
      // bookmarked the post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        message: "Post bookmarked successfully",
        success: true,
      });
    }
  } catch (error) {
    // console.log(error);
    console.error("Error in bookmarkPost:", error);
    return res.status(500).json({
      message: "Failed to toggle bookmark",
      success: false,
    });
  }
};
