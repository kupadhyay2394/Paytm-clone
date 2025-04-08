const express = require("express");
const { User } = require("../Schema/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { usermiddleware } = require("../middleware/user.middleware");
const bcrypt = require("bcryptjs");



const userRouter= express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
   
        
      const userName = req.body.userName;
      const firstName= req.body.firstName;
      const lastName= req.body.lastName;
      const paassword=req.body.password;
      const findUser= await User.findOne({userName:userName});
      if(findUser){
        return res.status(409).json({
          msg:"user Alredy exist"
        })
      }
      if(!(userName || firstName || lastName || paassword)){
        return res.status(400).json({msg:"all field required"})
      }
      
     
      const saltRounds = 10;
  
      const hash = await bcrypt.hash(paassword, saltRounds);
      console.log(`Hash: ${hash}`);
      const password = hash;
  
      console.log(password);
      
      const newUser = await User.create({
        firstName,
        lastName,
        userName,
        password,
      });
  
      res.status(201).json({
        msg: "User Created Successfully",
        userName,
      });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({
        msg: 'Error creating user',
        error: err.message,
      });
    }
  });



  userRouter.post("/login", async (req, res) => {
    try {
      const { userName, password } = req.body;
  
      const findUser = await User.findOne({ userName });
      if (!findUser) {
        return res.status(401).json({
          msg: 'Invalid username or password',
        });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          msg: 'Invalid username or password',
        });
      }

    
      const token = jwt.sign({ userName }, JWT_SECRET, { expiresIn: '1h' });
      console.log(`Token generated: ${token}`);
  
      res.status(200).json({
        msg: "User login successful",
        token,

      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({
        msg: 'Server error during login',
        error: err.message,
      });
    }
  });


userRouter.put("/update", usermiddleware ,async (req,res) => {
            const userName= req.userName;
            
            const newUserName = req.body.newUserName;
        
                const findUser= await User.findOneAndUpdate({
                    userName:userName
                },{userName:newUserName})
                console.log(findUser);
                
                if(findUser){
                    res.status(201).json({
                        msg:"User Updated"
                    })
                }else{
                    console.error('Error creating user:');
                    res.status(500).json({
                        msg: 'Error creating user'
                    });
                }
        
                
            })
userRouter.get("/findAs",usermiddleware, async (req,res) => {
    
    const userTobeFind= req.body.userTobeFind;

            
    const findUser = await User.find({
      userName: { $regex: new RegExp(userTobeFind, "i") },
    });
                   
                    
    if(findUser.length>0){
     const users = findUser.map((u) => ({
            userName: u.userName,
            password: u.password,
          }));

        
        res.status(201).json({
            msg:"got user",users
        });
    }
    else{
        res.status(401).json({
            msg:"No user name"
        })
    }
            
                    
})
module.exports= {
    userRouter
}