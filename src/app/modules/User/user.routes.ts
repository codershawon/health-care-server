import express from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import multer from "multer";
import { Role } from "@prisma/client";
import path from "path";
import { fileUploader } from "../../helpers/fileUploader";
const router = express.Router();


router.post("/", auth(Role.SUPER_ADMIN, Role.ADMIN), 
fileUploader.upload.single('file'),
userController.createAdmin);

export const userRoutes = router;