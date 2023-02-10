import express from "express";
import createHttpError from "http-errors";
import { createAccessToken } from "../../lib/tools.js";
import UsersModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/jwtAuth.js";
import { hostOnlyMiddleware } from "../../lib/hostOnly.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = await UsersModel(req.body);
    const { _id, role } = await newUser.save();
    const payload = { _id: _id, role: role };
    const accessToken = await createAccessToken(payload);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, `Credentials are not ok!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  const user = await UsersModel.findById(req.user._id);
  res.send(user);
});

usersRouter.get(
  "/me/accomodations",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    const host = await UsersModel.findById(req.user._id).populate({
      path: "accomodations",
    });
    res.send(host.accomodations);
  }
);

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) res.send(user);
    else
      next(
        createHttpError(404, `User with id: ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) res.send(updatedUser);
    else {
      next(
        createHttpError(404, `User with id: ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) res.status(204).send();
    else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});
export default usersRouter;
