import { Request, Response, NextFunction, RequestHandler } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode;

  if (error.code) statusCode = error.code;
  else statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV !== "production" ? "ERROR" : error.stack,
  });
};

export const routeNotFound: RequestHandler = (req, res, next) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};
