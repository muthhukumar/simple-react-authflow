import express from "express";
import cors from "cors";
import { json } from "body-parser";
import graphqlHttp from "express-graphql";
import helmet from "helmet"
import cookieParser from "cookie-parser";

import schema from "./graphql/Schema/index";
import userReducer from "./graphql/resolvers/user-resolver";
import Auth from "./middleware/AuthMiddleware";
import { routeNotFound, errorHandler } from "./middleware/ErrorMiddleware";
import authRoute from "./routes/userRoute";




require("./connection/Mongoose");

const app = express();

const PORT = process.env.PORT;

app.use(json());

app.use(helmet());

app.use(cookieParser());

app.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN
    })
);

app.use(Auth);

app.use("/user", authRoute);

app.use(
    "/graphql",
    graphqlHttp({
        schema: schema,
        rootValue: userReducer,
        graphiql: true
    })
);

app.use(routeNotFound);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening in the port ${PORT}`);
});
