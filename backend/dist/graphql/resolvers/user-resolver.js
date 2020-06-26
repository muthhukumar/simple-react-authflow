"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const HttpError_1 = __importDefault(require("../../models/HttpError"));
const generateToken_1 = require("../../util/generateToken");
const User_schema_1 = __importDefault(require("../../models/User-schema"));
const SocialUser_schema_1 = __importDefault(require("../../models/SocialUser-schema"));
const signup = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = args.credentials;
    if (!username || !email || !password) {
        throw new HttpError_1.default("Invalid credentials passed, check your credentials and try again", 422);
    }
    let existingUser;
    try {
        existingUser = yield User_schema_1.default.findOne({ email });
    }
    catch (err) {
        throw new HttpError_1.default("Error in establishing a database connection to create new user", 500);
    }
    if (existingUser)
        throw new HttpError_1.default("User already exist", 409);
    let hashedPassword;
    try {
        hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    }
    catch (err) {
        throw new HttpError_1.default("Something went wrong", 500);
    }
    const newUser = new User_schema_1.default({
        username,
        email,
        hashedPassword,
    });
    let createdUser;
    try {
        createdUser = yield newUser.save();
    }
    catch (err) {
        throw new HttpError_1.default("Something went wrong", 500);
    }
    return {
        _id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        hashedPassword: null,
    };
});
const login = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = args.credentials;
    if (!email || !password) {
        throw new HttpError_1.default("Invalid credentials passed, check your credentials and try again", 422);
    }
    let user;
    try {
        user = yield User_schema_1.default.findOne({ email });
    }
    catch (err) {
        throw new HttpError_1.default("Something went wrong", 500);
    }
    if (!user)
        throw new HttpError_1.default("user does not exist", 404);
    let isValid;
    try {
        isValid = yield bcryptjs_1.default.compare(password, user.hashedPassword);
    }
    catch (err) {
        throw new HttpError_1.default("Something went wrong", 500);
    }
    if (!isValid)
        throw new HttpError_1.default("Invalid credentials", 401);
    const accesstoken = generateToken_1.genAccesstoken(user.id);
    return {
        accesstoken,
        email: user.email,
        tokenExpiration: 1,
    };
});
const userDetails = (_, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuth) {
        throw new HttpError_1.default("Unauthorized", 401);
    }
    let user;
    if (req.isSocialAccount) {
        try {
            user = yield SocialUser_schema_1.default.findById(req.userId);
        }
        catch (err) {
            throw new HttpError_1.default("Something went wrong", 500);
        }
    }
    else {
        try {
            user = yield User_schema_1.default.findById(req.userId);
        }
        catch (err) {
            throw new HttpError_1.default("Something went wrong", 500);
        }
    }
    if (!user)
        throw new HttpError_1.default("User does not exist", 404);
    return {
        email: user.email,
        username: user.username,
        _id: user._id,
        hashedpassword: null,
    };
});
exports.default = {
    signup,
    login,
    userDetails,
};
