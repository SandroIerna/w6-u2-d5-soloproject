import jwt from "jsonwebtoken";

const options = { expiresIn: "1 day" };

export interface TokenPayload {
  _id: string;
  role: "User" | "Admin";
}

export const createAccessToken = (payload: TokenPayload) =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET!, options, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    })
  );

export const verifyAccessToken = (token: string): Promise<TokenPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload as TokenPayload);
    })
  );
