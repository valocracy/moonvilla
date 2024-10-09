import express from "express";
import { body } from "express-validator";

import controller from "@/controllers/file.controller";
//import jwtMiddleware from "@/middlewares/jwt.middleware";

const jsonRouter = express.Router();

jsonRouter.post("/create_files", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.createFiles.bind(controller)
]);

jsonRouter.post("/read_csv", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.readCsvFile.bind(controller)
]);


export default jsonRouter;
