import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import { json } from "body-parser";
import graphqlHttp from "express-graphql";

import schema from "./graphql/Schema/index";
import HttpError from "./models/HttpError";
import userReducer from "./graphql/resolvers/user-resolver";
import Auth from "./middleware/AuthMiddleware";
import path from "path";

//require("dotenv").config();
require("./connection/Mongoose");

const app = express();

const PORT = process.env.PORT;

app.use(json());
app.use(
   cors({
      credentials: true,
      origin: true
   })
);


app.use(Auth);
/*
app.use(express.static(path.join("public")));
*/
app.use(
   "/graphql",
   graphqlHttp({
      schema: schema,
      rootValue: userReducer,
      graphiql: true
   })
);
/*
app.use((_, res, _1) => {
   res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
*/

app.use((req, res, next)=>{
   throw new Error("could not find this route");
});

app.use((err: HttpError, _: Request, res: Response, next: NextFunction) => {
   if (res.headersSent) return next(err);
   res.status(err.code || 500).send(err.message || "Internal Server Error");
});

app.listen(PORT, () => {
   console.log(`Server is listening in the port ${PORT}`);
});
