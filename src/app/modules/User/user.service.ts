import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";
const createAdmin =async(data: any)=>{
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const userData={
        email: data.admin.email,
        password: hashedPassword,
        role: Role.ADMIN
    }

    const result =await prisma.$transaction(async(transactionClient)=>{
        const createdUserData = await transactionClient.user.create({
            data: userData
        })
        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        })
        return createdUserData;
    })
    return result;
}
export const userService={
    createAdmin
}