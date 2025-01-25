import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../helpers/jwtHelpers";

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
      "abcdefgererer", // Secret key
      "5m" // Token expiry time
    );
  
    const refreshToken = jwtHelpers.generateToken(
      {
        email: userData.email,
        role: userData.role,
      },
      "abcdefg", // Secret key
      "1h" // Token expiry time
    );
  
    return {
      accessToken,
      refreshToken,
      needPasswordChange: userData.needPasswordChange,
    };
  };

  const refreshToken = async(token: string)=>{
    console.log("Refresh token")
  }
  
export const AuthServices={
    loginUser,
    refreshToken
}