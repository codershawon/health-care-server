import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../helpers/paginationHelpers";
import { prisma } from "../../shared/prisma";
import { Admin, UserStatus } from "@prisma/client";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllFromDB = async (params: IAdminFilterRequest, options: IPaginationOptions) => {
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
                return { [key]: (filterData as any)[key] };
            }),
        })
    }

    andConditions.push({
        isDeleted: false
    })
    
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

const getByIdFromDB = async(id: string): Promise<Admin | null>=>{
   const result = await prisma.admin.findUnique({
         where:{
              id,
              isDeleted: false
         }
   })
   return result;
}

const updateIntoDB = async(id: string, data: Partial<Admin>):Promise<Admin | null>=>{

    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted: false
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
const deleteFromDB = async(id: string): Promise<Admin | null>=>{
    
    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    });

    const result= await prisma.$transaction(async(transactionClient)=>{
        const adminDeletedData= await transactionClient.admin.delete({
            where:{
                id
            }
        });
        await transactionClient.user.delete({
            where:{
                email: adminDeletedData.email
            }
        })
        return adminDeletedData;
    })
    return result;
}
const softDeleteFromDB = async(id: string): Promise<Admin | null>=>{

    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted: false
        }
    });

    const result= await prisma.$transaction(async(transactionClient)=>{
        const adminDeletedData= await transactionClient.admin.update({
            where:{
                id
            },
            data:{
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where:{
                email: adminDeletedData.email
            },
            data:{
                status: UserStatus.DELETED
            }
        })
        return adminDeletedData;
    })
    return result;
}
export const adminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
};

/* 
data = 1 2 3 4 5 6 7 8 9
page =2
limit=3
skip =3
formula = (page-1)*limit
(2-1)*3 = 3
*/  
