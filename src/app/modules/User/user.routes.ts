import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
const router = express.Router();

router.get("/", auth(Role.SUPER_ADMIN, Role.ADMIN), 
    userController.getAllFromDB)
    
router.post("/create-admin", auth(Role.SUPER_ADMIN, Role.ADMIN), 
fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) =>{
    req.body=userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
}
);

router.post("/create-doctor", auth(Role.SUPER_ADMIN, Role.ADMIN), 
fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) =>{
    req.body=userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createDoctor(req, res, next);
}
)

router.post(
    "/create-patient",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
        return userController.createPatient(req, res, next)
    }
);

router.patch(
    '/:id/status',
    auth(Role.SUPER_ADMIN, Role.ADMIN), 
    validateRequest(userValidation.updateStatus),
    userController.changeProfileStatus
);

export const userRoutes = router;