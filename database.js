import mongoose from 'mongoose';
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'PRODUCTION'){
    dotenv.config({path:"./config.env"})
}
const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then((con)=>console.log(`Mongo DB connected to ${con.connection.host}`)).catch((error)=>console.log(error))
}
export default connectDB;