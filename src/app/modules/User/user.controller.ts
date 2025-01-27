import { Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createDoctor(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});
const createPatient = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createDoctor(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Created successfuly!",
        data: result
    })
});
const getAllFromDB: RequestHandler = catchAsync(async(req: Request, res: Response) => {
    // console.log(req.query)
    const filters= pick(req.query, userFilterableFields);
    const options= pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    console.log(options)
    const result = await userService.getAllFromDB(filters, options);
    // res.status(200).json({
    //     success: true,
    //     message:"Admin data fetched",
    //     meta: result.meta,
    //     data: result.data
    // })
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message:"User data fetched",
        meta: result.meta,
        data: result.data
    })
})
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await userService.changeProfileStatus(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed successfully",
        data: result
    })
});

export const userController={
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus
}