import { Admin, Doctor, Patient, Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helpers/fileUploader";
import { IUploadedFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelpers";
import { userSearchableFields } from "./user.constant";

const createAdmin =async(req: Request): Promise<Admin>=>{
    const file = req.file as IUploadedFile;
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        console.log(uploadToCloudinary)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
        console.log(req.body)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userData={
        email: req.body.admin.email,
        password: hashedPassword,
        role: Role.ADMIN
    }

    const result =await prisma.$transaction(async(transactionClient)=>{
        await transactionClient.user.create({
            data: userData
        })
        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        })
        return createdAdminData;
    })
    return result;
}
const createDoctor =async(req: Request): Promise<Doctor>=>{
    const file = req.file as IUploadedFile;
    console.log(req.body)
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        console.log(uploadToCloudinary)
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
        console.log(req.body)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userData={
        email: req.body.doctor.email,
        password: hashedPassword,
        role: Role.DOCTOR
    }

    const result =await prisma.$transaction(async(transactionClient)=>{
        await transactionClient.user.create({
            data: userData
        })
        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        })
        return createdDoctorData;
    })
    return result;
}
const createPatient =async(req: Request): Promise<Patient>=>{
    const file = req.file as IUploadedFile;
    console.log(req.body)
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        console.log(uploadToCloudinary)
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
        console.log(req.body)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userData={
        email: req.body.patient.email,
        password: hashedPassword,
        role: Role.PATIENT
    }

    const result =await prisma.$transaction(async(transactionClient)=>{
        await transactionClient.user.create({
            data: userData
        })
        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        })
        return createdPatientData;
    })
    return result;
}
const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const {page, limit, skip} = paginationHelper.calculatePagination(options);
    //distrature the filter data
    const {searchTerm, ...filterData} = params;
    const andConditions: Prisma.UserWhereInput[] = [];
    // [
    //     {
    //         name: {
    //             contains: params.searchTerm,
    //         },
    //     },
    //     {
    //         email: {
    //             contains: params.searchTerm,
    //         },
    //     },
    // ]
    // console.log(filterData)
    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => {
                return { [field]: { contains: params.searchTerm } };
            }),
        });
    }
    if(Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return { [key]: (filterData as any)[key] };
            }),
        })
    }
    
    // console.dir(andConditions, {depth: "infinity"})

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
                [options.sortBy]: options.sortOrder
        }: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            patient: true,
            doctor: true
        }
        // include:{
        //     admin: true,
        //     patient: true,
        //     doctor: true
        // }
    });

    const total = await prisma.user.count({
        where: whereConditions
    })

    return {
        meta:{
            page,
            limit,
            total
        },
        data: result
    }
};

const changeProfileStatus = async (id: string, status: Role) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};
export const userService={
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus
}