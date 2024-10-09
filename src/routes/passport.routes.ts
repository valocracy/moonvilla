import express from "express";
import { body } from "express-validator";

import controller from "@/controllers/passport.controller";
//import jwtMiddleware from "@/middlewares/jwt.middleware";

const route = express.Router();

route.post("/error", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.error.bind(controller)
]);



export default route;
