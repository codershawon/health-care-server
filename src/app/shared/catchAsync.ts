import { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync =(fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
        //     res.status(500).json({
        //     success: false,
        //     message: (err instanceof Error ? err.name : "Something went wrong"),
        //     error: err
        // });
            next(error);
        }
    }
}