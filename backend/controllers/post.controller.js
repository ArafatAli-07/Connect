import sharp from "sharp";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import cloudinary from "../utils/cloudinary";

export const addNewPost = async(req, res)=>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if (caption && caption.length > 500) {
            return res.status(400).json({
                message: 'Caption is too long (max 500 characters)',
                success: false
            });
        }
        if(!image){
            return res.status(400).json({
                message:'Image required',
                success:false
            });
        }
        if (!authorId) {
            return res.status(401).json({
                message: 'Unauthorized. Author ID missing.',
                success: false
            });
        }

        //Image upload
        const optimizedImageBuffer = await sharp(image.buffer).resize({width:700,height:700,fit:"cover"}).toFormat('jpeg', {quality:80}).toBuffer();

        //buffer to datauri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author', select:'-password'});

        return res.status(201).json({
            message:'New post created successfully',
            post,
            success:true
        });

    } catch (error) {
        // console.log(error)
        console.error('Error in addNewPost:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};