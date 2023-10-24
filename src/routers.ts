import { NextFunction, Request, Response, Router} from "express";
import { testing2, testingController } from "./controller/testingRoutesController";

export const routes = (router: Router) => {
    router.use((req: Request, res:Response, next:NextFunction)=>{
        console.log("Come through me first")
        next();
    })
    router.get('/', testingController);
    router.get('/bye',testing2);

    router.use(()=>{
        console.log("Haha");
    })
}