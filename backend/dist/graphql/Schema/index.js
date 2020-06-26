"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema = graphql_1.buildSchema(`
    input signupDetails{
        username : String!
        email : String!
        password : String!
    }

    input loginCredentials{
        email : String!
        password: String!
    }

    type User{
        _id : ID!
        username : String!
        email : String!
        hashedPassword : String
    } 

    type AuthData{
        accesstoken : String
        email : String
        tokenExpiration : Int
    }

    type Query{
        userDetails : User
    }
    type Mutation{
        signup(credentials : signupDetails) : User
        login(credentials : loginCredentials) : AuthData
    }
    `);
exports.default = schema;
// schema{
//     query : RootQuery
//     mutation : RootMutation
// }
