import { Request, Response } from "express";
import { adminService } from "./admin.services";
import pick from "../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllFromDB = async(req:Request, res: Response) => {
    console.log(req.query)
    try{
       const filters= pick(req.query, adminFilterableFields);
       const options= pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
       console.log(options)
        const result = await adminService.getAllFromDB(filters, options);
    res.status(200).json({
        success: true,
        message:"Admin data fetched",
        meta: result.meta,
        data: result.data
    })
    }catch(err){
        res.status(500).json({
            success: false,
            message: (err instanceof Error ? err.name : "Something went wrong"),
            error: err
        });
    }
}

const getByIdFromDB = async(req:Request, res: Response) => {
    const {id} = req.params
     try{
        const result = await adminService.getByIdFromDB(id);
        res.status(200).json({
            success: true,
            message:"Admin data fetched by Id",
            data: result
        })
     }catch(err){
        res.status(500).json({
            success: false,
            message: (err instanceof Error ? err.name : "Something went wrong"),
            error: err
        });
    }
}

const updateIntoDB = async(req:Request, res: Response) => {
    const {id} = req.params
    console.log("data", req.body);
     try{
        const result = await adminService.updateIntoDB(id, req.body);
        res.status(200).json({
            success: true,
            message:"Data updated successfully",
            data: result
        })
     }catch(err){
        res.status(500).json({
            success: false,
            message: (err instanceof Error ? err.name : "Something went wrong"),
            error: err
        });
    }
}

const deleteFromDB = async(req:Request, res: Response) => {
    const {id} = req.params
    console.log("data", req.body);
     try{
        const result = await adminService.deleteFromDB(id);
        res.status(200).json({
            success: true,
            message:"Data deleted successfully",
            data: result
        })
     }catch(err){
        res.status(500).json({
            success: false,
            message: (err instanceof Error ? err.name : "Something went wrong"),
            error: err
        });
    }
}
const softDeleteFromDB = async(req:Request, res: Response) => {
    const {id} = req.params
    console.log("data", req.body);
     try{
        const result = await adminService.softDeleteFromDB(id);
        res.status(200).json({
            success: true,
            message:"Soft data deleted successfully",
            data: result
        })
     }catch(err){
        res.status(500).json({
            success: false,
            message: (err instanceof Error ? err.name : "Something went wrong"),
            error: err
        });
    }
}

export const adminController={
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}
