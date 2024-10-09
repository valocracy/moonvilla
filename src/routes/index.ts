import { Router } from "express";

import mintAlienRoutes from './mint_alien.routes'
import deployContractsRoutes from './deploy_contracts.routes'
import fileRoutes from './file.routes'
import writeImage from './writeImage.routes'
import wallet from './wallet.routes'
import passport from './passport.routes'
import valocracy from './valocracy.routes'

const apiRouter = Router();

apiRouter.use("/mint_alien", mintAlienRoutes);
apiRouter.use("/deploy", deployContractsRoutes);
apiRouter.use("/file", fileRoutes);
apiRouter.use("/write_image", writeImage);
apiRouter.use("/wallet", wallet);
apiRouter.use("/passport", passport);
apiRouter.use("/valocracy", valocracy);

export default apiRouter;