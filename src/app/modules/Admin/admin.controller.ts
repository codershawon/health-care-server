import { Request, Response } from "express";
import { adminService } from "./admin.services";
const getAllFromDB = async(req:Request, res: Response) => {
    try{
        const result = await adminService.getAllFromDB(req.query);
    res.status(200).json({
        success: true,
        message:"Admin data fetched",
        data: result
    })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.name || "Something went wrong",
            error: err
        });
    }
}

export const adminController={
    getAllFromDB
}
