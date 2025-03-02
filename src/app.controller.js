import connectDB from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/user.controller.js";
import companyRouter from "./modules/companies/company.controller.js";
import jobRouter from "./modules/jobs/job.controller.js";
import { globalErrorHandler } from "./utils/errorHandling.js";
import { limiter } from "./middleware/rateLimit.js";
import cors from 'cors';



const bootstrap = async (app, express) => {
    // connect to database 
    await connectDB();
    app.use(cors());
    app.use(limiter);

    //parsing request data
    app.use(express.json());

    // global error handler
    app.use(globalErrorHandler);


    //routes
    app.use("/auth", authRouter);
    app.use("/Users", userRouter);
    app.use("/Companies", companyRouter);
    app.use("/Jobs", jobRouter);




    // not found handler 
    app.use("*", (req, res, next) => {
        res.status(404).json({ success: false, message: "API not found!" });
    });
};

export default bootstrap;