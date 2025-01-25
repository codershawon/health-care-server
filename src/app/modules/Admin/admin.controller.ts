import { Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.services";
import pick from "../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { IAdminFilterRequest } from "./admin.interface";


const getAllFromDB: RequestHandler = catchAsync(async(req: Request, res: Response) => {
    // console.log(req.query)
    const filters= pick(req.query, adminFilterableFields);
    const options= pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    console.log(options)
    const result = await adminService.getAllFromDB(filters as IAdminFilterRequest, options);
    // res.status(200).json({
    //     success: true,
    //     message:"Admin data fetched",
    //     meta: result.meta,
    //     data: result.data
    // })
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message:"Admin data fetched",
        meta: result.meta,
        data: result.data
    })
})

const getByIdFromDB = catchAsync(async(req: Request, res: Response) => {
    const {id} = req.params
    const result = await adminService.getByIdFromDB(id);
    // res.status(200).json({
    //     success: true,
    //     message:"Admin data fetched by Id",
    //     data: result
    // })
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message:"Admin data fetched by Id",
        data: result
    })
})

const updateIntoDB = catchAsync(async(req:Request, res: Response) => {
    const {id} = req.params
    console.log("data", req.body);
    const result = await adminService.updateIntoDB(id, req.body);
    // res.status(200).json({
    //     success: true,
    //     message:"Data updated successfully",
    //     data: result
    // })
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message:"Data updated successfully",
        data: result
    })
})

const deleteFromDB = catchAsync(async(req:Request, res: Response) => {
    const {id} = req.params
    console.log("data", req.body);
    const result = await adminService.deleteFromDB(id);
    // res.status(200).json({
    //     success: true,
    //     message:"Data deleted successfully",
    //     data: result
    // })
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message:"Data deleted successfully",
        data: result
    })
})
const softDeleteFromDB = catchAsync(async(req:Request, res: Response) => {
    const {id} = req.params
    console.log("data", req.body);
    const result = await adminService.softDeleteFromDB(id);
    // res.status(200).json({
    //     success: true,
    //     message:"Soft data deleted successfully",
    //     data: result
    // })
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message:"Soft data deleted successfully",
        data: result
    })
})

export const adminController={
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}
