const messageModel=require("../Models/messageModel");
const chatModel=require("../Models/chatModel");
const createMessage= async (req,res) =>{
  
    const {chatId,senderId,text} =req.body;
  
    if (!chatId || !senderId || !text) {
        return res.status(400).json({
          message: "All fields (chatId, senderId, text) are required"
        });
      }
    const message=new messageModel( {
        chatId,senderId,text
    })
    try{
      const response=await message.save();
      await chatModel.findOneAndUpdate(
        { _id: chatId, members: { $ne: senderId } }, 
        { $inc: { unreadCount: 1 } } 
    );

      res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const getMessages=async (req,res)=>{
    const {chatId}=req.params;
    try{
    const messages=await messageModel.find({chatId}).sort({createdAt:1});
        res.status(200).json(messages);
      }catch(error){
          console.log(error);
          res.status(500).json(error);
      }
}

module.exports={createMessage,getMessages};