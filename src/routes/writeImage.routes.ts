import express from "express";

import controller from "@/controllers/writeImage.controller";
//import jwtMiddleware from "@/middlewares/jwt.middleware";

const jsonRouter = express.Router();

jsonRouter.post("/passport_date", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.writePassport.bind(controller)
]);

jsonRouter.post("/add_test_image", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.addTestImage.bind(controller)
]);


export default jsonRouter;
