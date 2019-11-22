import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { User, UserGender } from "./Entity/User";
// import routes from "./routes";

//Connects to the Database -> then starts the express
createConnection()
	.then(async (connection) => {
		// Create a new express application instance
		const app = express();
		dotenv.config({ path: "../config/config.env" });
		const PORT = process.env.PORT || 5000;

		// Call midlewares
		app.use(cors());
		app.use(helmet());
		app.use(bodyParser.json());

		//Set all routes from routes folder
		// app.use("/", routes);

		////////////////
		const user = new User();
		user.name = "sina";
		user.lastname = "ebr";
		user.email = "ebrsina2";
		user.password = "jesus";
		user.dob = new Date();
		user.role = UserGender.MAN;
		await user.save();

		const me = await User.findOne();
		console.log(me);

		app.listen(PORT, () => {
			console.log(
				`Server started on port ${PORT} and ${process.env.NODE_ENV}`,
			);
		});
	})
	.catch((error) => console.log(error));

process.on("unhandledRejection", (err: any, promise) => {
	console.error(`error ${err.message}`);
});
