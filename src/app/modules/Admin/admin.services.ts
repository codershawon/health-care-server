import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const getAllFromDB = async (params:any) => {
    console.log({params})
    // const searchTerm = params.searchTerm.toLowerCase(); 
    const result = await prisma.admin.findMany({
        where:{
            OR:[
              {
                name: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                },
                email: {
                    contains: params.searchTerm,
                }
              }
            ]
        }
    });
    return result;
}
export const adminService = {
    getAllFromDB
}