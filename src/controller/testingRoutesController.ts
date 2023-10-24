import {NextFunction, Request, Response} from 'express';

export const testingController = async (req:Request, res: Response) => {
    console.log(req.body);
    res.send("hello");
}

export const testing2 = async (req:Request, res: Response, next: NextFunction) => {
    console.log("testing2");
    res.send("testing2");
    next();
}