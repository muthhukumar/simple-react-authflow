"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = exports.errorHandler = void 0;
exports.errorHandler = (error, req, res, next) => {
    let statusCode;
    if (error.code)
        statusCode = error.code;
    else
        statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? "ERROR" : error.stack,
    });
};
exports.routeNotFound = (req, res, next) => {
    const error = new Error(`Not Found ${req.originalUrl}`);
    res.status(404);
    next(error);
};
