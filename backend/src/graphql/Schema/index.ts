import { buildSchema } from "graphql";

const schema = buildSchema(`
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
        isVerified : Boolean!
    } 

    type AuthData{
        accesstoken : String
        email : String
        tokenExpiration : Int
        isVerified : Boolean!
    }

    type Query{
        userDetails : User
    }
    type Mutation{
        signup(credentials : signupDetails) : User
        login(credentials : loginCredentials) : AuthData
    }
    `);

export default schema;
// schema{
//     query : RootQuery
//     mutation : RootMutation
// }
