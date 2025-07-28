const mongoose = require('mongoose');
const express=require("express");
const path=require('multer');
const bcrypt=require('bcryptjs');
const {registerUser, loginUser,updateUserStatus,getUsers,findUser}=require("../Controllers/userController");


const multer = require("multer");
const router = express.Router();
const userModel = require("../Models/userModel");

router.post("/register", registerUser);
router.post("/login",loginUser);
router.put('/update-user-status', updateUserStatus);
router.get('/', getUsers);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/avatars/"); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });
router.get("/find/:userId", async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
        const user = await userModel.findById(req.params.userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found:", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

router.put('/find/:id', upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const updateData = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
    
      updateData.avatar = req.file.path.replace(/\\/g, '/');
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser); 
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/:userId/suspend', async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: "User status updated successfully", user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body; 

  try {
    const user = await userModel.findById(id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "User status updated successfully", user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
});

router.get("/blocked-users", async (req, res) => {
  try {
   
    const blockedUsers = await userModel.find({ status: "blocked" });
    res.status(200).json(blockedUsers);
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ message: "Error fetching blocked users" });
  }
});

// router.put("/unblock-user/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await userModel.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//   S
//     user.status = "active";
//     await user.save();

//     res.status(200).json({ message: "User unblocked successfully", user });
//   } catch (error) {
//     console.error("Error unblocking user:", error);
//     res.status(500).json({ message: "Error unblocking user" });
//   }
// });


router.put("/unblock-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate user has status field
    if (typeof user.status === 'undefined') {
      return res.status(400).json({ message: "User model doesn't have status field" });
    }

    user.status = "active";
    await user.save();

    res.status(200).json({ 
      message: "User unblocked successfully", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ 
      message: "Error unblocking user",
      error: error.message 
    });
  }
});
module.exports=router;