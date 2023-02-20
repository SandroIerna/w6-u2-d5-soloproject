import createHttpError from "http-errors";
import { RequestHandler, Request } from "express";
import { TokenPayload } from "./tools";

interface UserRequest extends Request {
  user?: TokenPayload;
}

export const hostOnlyMiddleware: RequestHandler = (
  req: UserRequest,
  res,
  next
) => {
  if (req.user?.role === "Admin") next();
  else {
    next(createHttpError(403, "This endpoint is available just for hosts!"));
  }
};
