import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

// For chatting 
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required",
      });
    }

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        //Establish the conversation if not started yet
        if(!conversation) {
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage)conversation.message.push(newMessage._id);
        
        await Promise.all([conversation.save(), newMessage.save()])

        // implement socket io for real time data transfer


        return res. status(201).json({
            success: true,
            newMessage
        })
    
    } catch (error) {
        // console.log(error);
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      message: "Failed to fetch sendMessage",
      success: false,
    });
    }
}

export const getMessage = async (req, res) =>{
    try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("message");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        message: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: conversation?.message,
    });
    } catch (error) {
           // console.log(error);
    console.error("Error in getMessage:", error);
    return res.status(500).json({
      message: "Failed to fetch getMessage",
      success: false,
    }); 
    }
}