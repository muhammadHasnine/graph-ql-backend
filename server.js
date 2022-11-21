import {ApolloServer,gql} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground,ApolloServerPluginLandingPageDisabled} from 'apollo-server-core';
import typeDefs from './schema.js';
import connectDB from './database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config()
}
connectDB()
import "./models/User.js"
import "./models/Quote.js"
import resolvers from './resolvers.js';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>{
        const {authorization} = req.headers
        if(authorization){
            const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)
            return {userId}
        }
    },
    plugins:[
        process.env.NODE_ENV !=="PRODUCTION" ?  ApolloServerPluginLandingPageGraphQLPlayground() : ApolloServerPluginLandingPageDisabled()
    ]
})
const PORT = process.env.PORT || 4000
server.listen(PORT,()=>{
    console.log(`🚀 Server listening at: ${PORT}`)
})
