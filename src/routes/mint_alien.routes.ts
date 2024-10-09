import express from "express";
import { body } from "express-validator";

import controller from "@/controllers/mint-alien.controller";
//import jwtMiddleware from "@/middlewares/jwt.middleware";

const mintAlienRouter = express.Router();

mintAlienRouter.post("/set_address_whitelist", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.setWhitelistAddress.bind(controller)
]);

mintAlienRouter.post("/status_mint_level", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.setStatusMintLevel.bind(controller)
])

mintAlienRouter.get("/status_mint_level", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.getStatusMinLevel.bind(controller)
])

mintAlienRouter.post("/configure_mint_alien", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.setConfigMintAlien.bind(controller)
])

mintAlienRouter.post("/mint_alien_whitelist", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.mintAlienWhitelist.bind(controller)
])

mintAlienRouter.post("/set_csv_address_whitelist", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.setWhistelistByCSVFile.bind(controller)
])

mintAlienRouter.get("/whitelist_count", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.whitelistCount.bind(controller)
])

mintAlienRouter.post("/start", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.start.bind(controller)
])

mintAlienRouter.post("/mint", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.start.bind(controller)
])

mintAlienRouter.get("/current_mint", [
  //jwtMiddleware.validJWTNeeded.bind(jwtMiddleware),
  controller.getCurrentMint.bind(controller)
])


export default mintAlienRouter;
