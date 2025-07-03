const userModel=require("../Models/userModel");
const bcrypt=require("bcryptjs");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const adminLogsModel = require("../Models/adminLogsModel");


const createToken=(_id)=>{
    const jwtkey=process.env.JWT_SECRET_KEY;
    return jwt.sign({_id},jwtkey,{expiresIn: "3d"});
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    console.log("Registration request received:", { name, email, role });


    if (password !== confirmPassword) {
      return res.status(400).json({ error: true, message: "Passwords do not match." });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

   
    const token = createToken(newUser._id);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
      role: newUser.role,
    });
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({ error: true, message: "Internal server error during registration." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required..." });
  }

  try {
  
    let user = await userModel.findOne({ email });

    if (!user) {
      const admin = await adminLogsModel.findOne({ email });

      if (!admin) {
        return res.status(400).json({ message: "Invalid email or password..." });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid email or password..." });
      }

      const token = createToken(admin._id);
      return res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email,
        token,
        role: 'admin', 
        avatar: admin.avatar,
        message: "Admin login successful",
      });
    }

   
    if (user.status === 'suspended') {
      return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password..." });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      token,
      role: user.role, 
      avatar: user.avatar,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (status !== 'active' && status !== 'suspended') {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users );
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
const findUser=async(req,res)=>{
  const userId=req.params.userId;
  try{
  const user=await userModel.findById(userId);
  res.status(200).json(user);
  }
  catch(error){
      console.log(error);
      res.status(500).json(error);
  }

};


module.exports={registerUser,loginUser,updateUserStatus,getUsers,findUser};