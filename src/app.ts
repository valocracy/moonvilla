import express, { Application } from "express";
import env from "@/config";
import loaders from "@/loaders";
import mempoolService from "./services/mempool.service";

async function startServer() {
	const app: Application = express();

	await loaders(app);
	const server = app.listen(env.PORT, () => {
		console.log(`
			##############################
			Server listening on port: ${env.PORT}
			##############################`);
	}).on("error", (err: any) => {
		console.log(err);
		process.exit(1);
	});

}

startServer();
//mempoolService.monitorMempool()

// setTimeout(() => {
// console.log(mongoose.connections.length);
// mongoose.connection.db.listCollections().toArray(function (err, names) {
//   console.log(names);
// });
// }, 3000);
