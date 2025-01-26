import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
const app: Application= express();
app.use(cors())
app.use(cookieParser())

//parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response)=>{
    res.send({
        message: "Hello World"
    })
});

app.use("/api/v1", router);
app.use(globalErrorHandler)
app.use((req: Request, res: Response,next: NextFunction)=>{
    console.log(req)
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Page not found",
        error:{
            path: req.originalUrl,
            message: "Your requested page does not exist"
        }
    })
})
export default app;