import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin =async(req: Request, res: Response)=>{
    try{
    const result= await userService.createAdmin(req.body);
    console.log(result)
    res.status(200).json({
        success: true,
        message: "Admin created successfully",
        data: result
    })
    }catch(err){
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.name || "Something went wrong",
                error: err.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: err
            });
        }
    }
}
export const userController={
    createAdmin
}