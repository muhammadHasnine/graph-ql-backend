import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const User = mongoose.model("User");
const Quote = mongoose.model("Quote")
const resolvers = {
    Query:{
       users:async()=>await User.find({}),
       user:async(_,{_id})=>await User.findById(_id),
       quotes:async()=>await Quote.find({}).populate("by","_id firstName"),
       iquote:async(_,{by})=>await Quote.find({by}),
       myProfile:async(_,args,{userId})=>{
        if(!userId) throw new Error("You must logged in first")
        return await User.findById(userId)
       }
    },
    User:{
        quotes:async(ur)=>await Quote.find({by:ur._id}) 
    },
    //ToDo Update and Delete.....
    Mutation:{
        signUp:async(_,{userNew})=>{
            const user = await User.findOne({email:userNew.email});
            if(user){
                throw new Error("User already exists with that email")
            } 
            const hashedPassword = await bcrypt.hash(userNew.password,10);
            const newUser = new User({
                ...userNew,
                password:hashedPassword
            })
            return await newUser.save()
        },
        signin:async(_,{userSignin})=>{
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
        },
        createQuote:async(_,{name},{userId})=>{
            if(!userId) throw new Error("You must logged in first")
            const newQuote = new Quote({
                name,
                by:userId
            })
            await newQuote.save();
            return "Quote is Created"
        }
    }
}
export default resolvers;