// const jwt = require("jsonwebtoken");
import * as jwt from "jsonwebtoken";
import { asyncHandler } from "./async";
import { ErrorResponse } from "../utils/errorResponse";
import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User";

interface ExtendedRequest extends Request {
  user?: any;
  org?: any
}

// Protect routes
export const userProtect = (userType?: string) => asyncHandler(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    let token: string;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
      // Set token from cookie
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {

      if (userType === "org") {
        // Verify token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_ORG);
        req.org = decoded;
        // req.user = await User.findOneOrFail(decoded.id);

      } else {
        // Verify token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_USER);
        req.user = decoded;
        // req.user = await User.findOneOrFail(decoded.id);

      }

      next();
    } catch (err) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }
);

// Grant access to specific roles
export const authorize = (...roles: any[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role) || !roles.includes(req.org.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
