import express from "express";
import createHttpError from "http-errors";
import AccomodationsModel from "./model.js";
import UsersModel from "../users/model.js";
import { JWTAuthMiddleware } from "../../lib/jwtAuth.js";
import { hostOnlyMiddleware } from "../../lib/hostOnly.js";

const AccomodationsRouter = express.Router();

AccomodationsRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newAccomodation = await AccomodationsModel(req.body);
      const { _id } = await newAccomodation.save();
      const updatedHost = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { $push: { accomodations: _id } },
        { new: true, runValidators: true }
      );
      res.status(201).send({ _id, updatedHost });
    } catch (error) {
      next(error);
    }
  }
);

AccomodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find();
    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

AccomodationsRouter.get(
  "/:accomodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(
        req.params.accomodationId
      );
      if (accomodation) res.send(accomodation);
      else
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} not found!`
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

AccomodationsRouter.put(
  "/:accomodationId",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const host = await UsersModel.findById(req.user._id).populate({
        path: "accomodations",
      });
      console.log(host.accomodations);
      if (
        host.accomodations.filter(
          (accomodation) =>
            accomodation._id.toString() === req.params.accomodationId
        ) !== -1
      ) {
        const updatedAccomodation = await AccomodationsModel.findByIdAndUpdate(
          req.params.accomodationId,
          req.body,
          { new: true, runValidators: true }
        );
        if (updatedAccomodation) res.send(updatedAccomodation);
        else
          next(
            createHttpError(
              404,
              `Accomodation with id ${req.params.accomodationId} not found!`
            )
          );
      } else {
        next(
          createHttpError(
            401,
            `Only the owner of the accomodation can modify it!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

AccomodationsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default AccomodationsRouter;
