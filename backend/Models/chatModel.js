const mongoose=require("mongoose")
const chatSchema=new mongoose.Schema({
    members:Array,
    unreadCount: { type: Number, default: 0 },
},{
    timestamps:true,
}


);
const chatModel=mongoose.model("Chat",chatSchema);
module.exports=chatModel;