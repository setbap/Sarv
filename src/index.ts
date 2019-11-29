import "reflect-metadata";
import { createConnection, getConnection, getRepository } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { User } from "./entity/User";

import { errorHandler } from "./middleware/error";
import * as cookieParser from "cookie-parser";
import * as fileupload from "express-fileupload";
import { join } from "path";
import routes from "./Routes";
// import routes from "./routes";

//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    // Create a new express application instance
    const app = express();
    dotenv.config({ path: join(__dirname, "..", "config", "config.env") });
    const PORT = process.env.PORT || 5000;

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(fileupload());

    app.use("/", routes);

    app.use(errorHandler);

    //Set all routes from routes folder
    // app.use("/", routes);

    ////////////////
    // const user = new User();
    // user.name = "sina";
    // user.lastname = "ebr";
    // user.email = "ebrsina5312";
    // user.password = "jesus";
    // user.dob = new Date();
    // user.role = UserGender.MAN;
    // await user.save();

    // const me = await User.findOne(3);
    // const org = new TouristOrganization();
    // org.name = "test";
    // org.description = "small compani";
    // org.email = "ebrsina3test";
    // org.password = "jesusprime";
    // org.orgCreator = me;
    // await org.save();
    // const p1 = new Place();
    // p1.name = "st";
    // p1.latitude = 12.343434;
    // p1.longitude = 40.23232;

    // const p2 = new Place();
    // p2.name = "st2";
    // p2.latitude = 32.343434;
    // p2.longitude = 50.23232;
    // await p1.save();
    // await p2.save();
    // const me = await User.findOne();
    // const org = await TouristOrganization.findOne();

    // const tour = new Tour();
    // tour.name = "t1";
    // tour.tourCapacity = 40;
    // tour.remainingCapacity = 40;
    // tour.source = p1;
    // tour.destination = p2;
    // tour.startDate = new Date();
    // tour.finishDate = new Date();
    // tour.hardShipLevel = 3.5;
    // tour.price = 40000;
    // tour.description = "this is firs tour";
    // tour.organiaztion = org;

    // await tour.save();

    // const me = await User.findOne();
    // console.log(me);
    // const org1 = await Tour.findOne();
    // await getConnection()
    // 	.createQueryBuilder()
    // 	.relation(Tour, "users")
    // 	.of(org1)
    // 	.add(me);
    // const postRepository = getRepository(Tour);
    // const post = await postRepository.findOne(2, { relations: ["users"] });
    // post.users.push(me);
    // post.remainingCapacity--;
    // await postRepository.save(post);
    // console.log(org1);

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} and ${process.env.NODE_ENV}`);
    });
  })
  .catch(error => console.log(error));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any, promise: Promise<any>) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
