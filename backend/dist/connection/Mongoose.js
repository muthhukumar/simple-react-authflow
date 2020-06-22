"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ATLAS_URI = process.env.ATLAS_URI;
mongoose_1.default.connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose_1.default.connection.on("connected", () => {
    console.log("MongoDB connection established");
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
});
mongoose_1.default.connection.on("error", (err) => {
    console.log("Error in MongoDB connection " + err);
});
