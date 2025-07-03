
const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, minlength: 3, maxlength: 200, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    saved_listings: [{
     type: mongoose.Schema.Types.ObjectId, ref: 'Property'
      
    }],
    role: { type: String, required: true, enum: ['buy/rent', 'sell'] },
    avatar: { type: String },
    status: { type: String,default: 'active',enum:['suspended','blocked','active']},
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  }, {
    timestamps: true,
    strict: false,
  });
  const userModel = mongoose.model("User", userSchema);
  module.exports=userModel;