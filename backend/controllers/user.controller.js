import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Try different email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: user.post,
    };

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select('-password');
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile Updated successfully",
            success: true,
            user
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message || "Internal server error.",
            success: false
        });
    }
};

export const getSuggestUsers = async (req, res) => {
  try {
    const suggestUsers = await User.find({ _id: { $ne: req.id } }).select("-password",);
    if(!suggestUsers){
        return res.status(400).json({
            message: 'Currently do not have any user',
        })
    };
    return res.status(200).json({
        success: true,
        users: suggestUsers
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal server error.",
      success: false,
    });
  }
};

export const followOrUnfollow = async (req, res)=>{
    try {
        const followerId = req.id; // The user who is following
        const followeeId = req.params.id; // The user who is being followed
        if(followerId === followeeId){
            return res.status(400).json({
                message:"You can't follow yourself.",
                success:false
            });
        }

        const user = await User.findById(followerId);
        const targetUser = await User.findById(followeeId);

        if(!user || !targetUser){
            return res.status(404).json({
                message:'user not found',
                success:false
            });
        }

        const isFollowing = user.following.includes(followeeId);
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id:followerId}, {$pull:{following:followeeId}}),
                User.updateOne({_id:followeeId}, {$pull:{followers:followerId}})
            ]);
            return res.status(200).json({
                message:"Unfollowed successfully",
                success:true
            });
        }else{
            await Promise.all([
                // User.updateOne({_id:followerId}, {$push:{following:followeeId}}),   //$push works, but it can cause duplicate entries. To prevent this, useing $addToSet
                // User.updateOne({_id:followeeId}, {$push:{followers:followerId}})
                User.updateOne({_id:followerId}, {$addToSet:{following:followeeId}}),
                User.updateOne({_id:followeeId}, {$addToSet:{followers:followerId}})
            ]);
            return res.status(200).json({
                message:"Followed successfully",
                success:true
            });
        }

    } catch (error) {
        // console.log(error);
        console.error("Follow/Unfollow Error:", error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};
