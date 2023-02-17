import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./api/users/index.js";
import AccomodationsRouter from "./api/accomodations/index.js";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 3001;

/* *************************** Middlewares *************************** */

server.use(cors());
server.use(express.json());

/* **************************** Endpoints **************************** */

server.use("/users", usersRouter);
server.use("/accomodations", AccomodationsRouter);

/* ************************* Error handlers ************************** */

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("You are connected to Mongo, congrats!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port: ${port}`);
  });
});
