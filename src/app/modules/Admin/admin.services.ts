import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../helpers/paginationHelpers";
import { prisma } from "../../shared/prisma";
import { Admin } from "@prisma/client";

const getAllFromDB = async (params: any, options: any) => {
    const {page, limit, skip} = paginationHelper.calculatePagination(options);
    //distrature the filter data
    const {searchTerm, ...filterData} = params;
    const andConditions =[];
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
            OR: adminSearchableFields.map((field) => {
                return { [field]: { contains: params.searchTerm } };
            }),
        });
    }
    if(Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return { [key]: filterData[key] };
            }),
        })
    }
    
    // console.dir(andConditions, {depth: "infinity"})

    const whereConditions ={AND : andConditions}

    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
                [options.sortBy]: options.sortOrder
        }: {
            createdAt: 'desc'
        } 
    });

    const total = await prisma.admin.count({
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

const getByIdFromDB = async(id: string)=>{
   const result = await prisma.admin.findUnique({
         where:{
              id
         }
   })
   return result;
}

const updateIntoDB = async(id: string, data: Partial<Admin>)=>{

    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    });
   const result = await prisma.admin.update({
    where:{
        id
    },
    data
   })
   return result;
}
export const adminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB
};

/* 
data = 1 2 3 4 5 6 7 8 9
page =2
limit=3
skip =3
formula = (page-1)*limit
(2-1)*3 = 3
*/  
