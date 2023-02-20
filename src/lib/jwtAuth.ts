import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools";
import { RequestHandler, Request } from "express";
import { TokenPayload } from "./tools";

interface UserRequest extends Request {
  user?: TokenPayload;
}

export const JWTAuthMiddleware: RequestHandler = async (
  req: UserRequest,
  res,
  next
) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide a Bearer Token in the authorization header!"
      )
    );
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");
      const payload = await verifyAccessToken(accessToken);
      req.user = { _id: payload._id, role: payload.role };
      next();
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
