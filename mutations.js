import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const User = mongoose.model("User");
export const signin = async(_,{userSignin})=>{
    const user = await User.findOne({email:userSignin.email});
    if(!user){
        throw new Error("User dosent exists with that email")
    }
    const isMatch = await bcrypt.compare(userSignin.password,user.password);
    if(!isMatch){
        throw new Error("email or password is invalid")
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET)
    return{token}
}