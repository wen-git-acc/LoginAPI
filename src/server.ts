import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { routes } from './routers';
import { authRouteController } from './controller/authRouteController';
require('dotenv').config();


const app = express();
const port = process.env.PORT;
// const testRouter = express.Router();
const authRouter = express.Router();

// const corsCofig = {
//     origin: ['http://localhost:3001'],
//     credential: true
// }


app.use(express.json());
app.use(cookieParser());


// routes(testRouter);
authRouteController(authRouter);

// app.use("/routeone",testRouter);
app.use("/auth",authRouter);


app.use((_req:Request,_res: Response,next: NextFunction)=>{
    console.log("This is the last middleware");
    next();
})

// Catch-all route for unrecognized routes
app.use((req, res, next) => {
    res.status(404).send('Not Found');
  });
  
app.listen(port, ()=> {
    console.log(`Listening at ${port}`)
});