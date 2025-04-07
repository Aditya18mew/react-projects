const jwt=require("jsonwebtoken")
const {connectdb,user}=require("./login details/db")
require("dotenv").config()
const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET
const RESET_TOKEN_SECRET=process.env.RESET_TOKEN_SECRET

async function generatejwt(email){

    const User=await user.findOne({Email:email})

    const accesstoken=jwt.sign({
        id:User._id,
        Email:User.Email
    },ACCESS_TOKEN_SECRET,{expiresIn:"120m"})

   
return accesstoken

}

async function generateresetjwt(email){

      const User= await user.findOne({Email:email})

      const resetToken=jwt.sign({
        id:User._id,
        Email:User.Email
      },RESET_TOKEN_SECRET,{expiresIn:"10m"})

    User.ResetToken=resetToken
    User.TokenExpiry=new Date(Date.now()+10*60*1000)
    await User.save()

}



module.exports={generatejwt,generateresetjwt}