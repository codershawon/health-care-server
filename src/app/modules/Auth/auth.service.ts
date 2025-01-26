import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../../config";
import { emailSender } from "./emailSender";
import ApiError from "../../erros/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email,
        status: UserStatus.ACTIVE,
      },
    });
  
    const isCorrectPassword = await bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
      throw new Error("Password incorrect!");
    }
  
    // Generate access and refresh tokens
    const accessToken = jwtHelpers.generateToken(
      {
        email: userData.email,
        role: userData.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
  
    const refreshToken = jwtHelpers.generateToken(
      {
        email: userData.email,
        role: userData.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
  
    return {
      accessToken,
      refreshToken,
      needPasswordChange: userData.needPasswordChange,
    };
  };

  const refreshToken = async(token: string)=>{
    let decodedData;
    try{
      decodedData= jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }catch(err){
      throw new Error("Invalid token");
    }
    const userData = await prisma.user.findUniqueOrThrow({
      where:{
        email: decodedData.email,
        status: UserStatus.ACTIVE
      }
    })
    const accessToken = jwtHelpers.generateToken(
      {
        email: userData?.email,
        role: userData?.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );
    return {
      accessToken,
      needPasswordChange: userData.needPasswordChange,
    };
  }

  const changePassword=async(user: any, payload: any)=>{
     const userData = await prisma.user.findFirstOrThrow({
      where:{
        email: user.email,
        status: UserStatus.ACTIVE,
      }
     })
     const isCorrectPassword = await bcrypt.compare(payload.oldPassword, userData.password);
     if (!isCorrectPassword) {
       throw new Error("Password incorrect!");
     }
      const hashedPassword = await bcrypt.hash(payload.newPassword, 10)
      await prisma.user.update({
        where:{
          email: userData.email,
        },
        data:{
          password: hashedPassword,
          needPasswordChange: false
        }
      })

      return {
        message: "Password changed successfully"
      }
   
  }
  const forgotPassword=async(payload: {email: string})=>{
     const userData = await prisma.user.findUniqueOrThrow({
      where:{
        email: payload.email,
        status: UserStatus.ACTIVE,
      }
     })
     const resetPassToken = jwtHelpers.generateToken({email: userData.email, role: userData.role},
      config.jwt.reset_pass_token_secret as Secret,
      config.jwt.reset_pass_token_expires_in as string
     )
     console.log(resetPassToken)

     const resetPassLink= config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`
     await emailSender(
      userData.email,
      "Password Reset",
      `
      <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>>
      `
     )
     console.log(resetPassLink)



     // http://localhost:3000/reset-pass?email=shawon@gmail.com&token=xxxxxxxx
  }
  const resetPassword =async(token: string, payload:{id: string, password: string})=>{
   console.log({token, payload})

   const userData = await prisma.user.findFirstOrThrow({
    where:{
      id: payload.id,
      status: UserStatus.ACTIVE
    }
   })
   const isValidToken = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret)
   if(!isValidToken){
     throw new ApiError(httpStatus.FORBIDDEN, "Forbidden")
   }
   //hash password
   const hashedPassword = await bcrypt.hash(payload.password, 10);
    // update into database
    await prisma.user.update({
      where:{
        id: payload.id,
      },
      data:{
        password: hashedPassword
      }
    })
  }
  
export const AuthServices={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}