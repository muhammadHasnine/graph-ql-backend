import {gql} from 'apollo-server-express';
const typeDefs = gql`
    type Query{
        users:[User]
        user(_id:ID!):User
        quotes:[QuoteWithName]
        iquote(by:ID!):[Quote]
        myProfile:User
    }
    type QuoteWithName{
        _id:String
        name:String
        by:IdName
    }
    type IdName{
        _id:String
        firstName:String
    }
    type User{
        _id:ID!
        firstName:String!
        lastName:String!
        email:String!
        quotes:[Quote]
    }
    type Quote{
        name:String!
        by:String!
    }
    type Token{
        token:String!
    }
    type Mutation{
        signUp(userNew:userInput!):User
        signin(userSignin:userSigninInput!):Token
        createQuote(name:String!):String
    }
    input userInput{
        firstName:String!
        lastName:String!
        email:String!
        password:String!
    }
    input userSigninInput{
        email:String!
        password:String!
    }
`
export default typeDefs