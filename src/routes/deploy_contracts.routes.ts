import express from "express";

import controller from "@/controllers/deploy-contracts.controller";
//import jwtMiddleware from "@/middlewares/jwt.middleware";

const DeployContractsRouter = express.Router();

DeployContractsRouter.post("/passport_alien", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.passportAlien.bind(controller)
]);

export default DeployContractsRouter;
