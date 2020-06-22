"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const express_graphql_1 = __importDefault(require("express-graphql"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./graphql/Schema/index"));
const user_resolver_1 = __importDefault(require("./graphql/resolvers/user-resolver"));
const AuthMiddleware_1 = __importDefault(require("./middleware/AuthMiddleware"));
const ErrorMiddleware_1 = require("./middleware/ErrorMiddleware");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
require("./connection/Mongoose");
const app = express_1.default();
const PORT = process.env.PORT;
app.use(body_parser_1.json());
app.use(helmet_1.default());
app.use(cookie_parser_1.default());
app.use(cors_1.default({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}));
app.use(AuthMiddleware_1.default);
app.use("/user", userRoute_1.default);
app.use("/graphql", express_graphql_1.default({
    schema: index_1.default,
    rootValue: user_resolver_1.default,
    graphiql: true
}));
app.use(ErrorMiddleware_1.routeNotFound);
app.use(ErrorMiddleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is listening in the port ${PORT}`);
});
