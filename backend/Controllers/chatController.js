const chatModel=require("../Models/chatModel");

const createChat=async(req,res)=>{
    const {firstId,secondId}=req.body;
    try{
        const chat=await chatModel.findOne({
            members:{$all:[firstId,secondId]},

        });
        if(chat) return res.status(200).json(chat);
        const newChat=new chatModel({
            members:[firstId,secondId]
        })
        const response=await newChat.save();
        res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};
const findUserChats=async(req,res)=>{
    const userId=req.params.userId;
    try{
        const chats=await chatModel.find({
          members:{$in: [userId]}  
        }).select("members unreadCount updatedAt");
        res.status(200).json(chats);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;
    try {
        const chat = await chatModel.findOneAndUpdate(
            { members: { $all: [firstId, secondId] } },
            { $set: { unreadCount: 0 } }, 
            { new: true } 
        );
        res.status(200).json(chat);
    } catch (error) {
        console.log("Error finding chat:", error);
        res.status(500).json(error);
    }
};
module.exports={createChat,findUserChats,findChat};