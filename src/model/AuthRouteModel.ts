import { NextFunction, Request, Response } from "express";
import { isEmailFormat, isUserExist as isUserExist, isValidRequestBody, pushSignUpData, userVerification } from "./helper/generalModelHelper";
import { generateTokens, verifyRefreshToken } from "./helper/TokenModel";
import { generateTokenInputType, tokenResponseType } from "./config/TokenModelConfig";
import { firestore } from "../Utility/Firestore/Firestore";
import { userInformationType } from "./config/UserDataConfig";
import { comparePassword, hashPassword } from "./helper/HashModel";
import { loginTokenBodyType } from "./config/generalModelHeperConfig";



export async function login(req: Request, res: Response, next: NextFunction){
    const Payload: loginTokenBodyType = req.body;
    console.log(typeof Payload);
    if(!isValidRequestBody<loginTokenBodyType>(Payload)){
        return res.status(400).json({error: "Invalid Request Body"});
    }

    //validate the credential and return body below.
    console.log(isEmailFormat(Payload.identifier));
    userVerification(Payload);
    const validationData = {
        emailAddress: "abc",
        roles: ["user", "admin", "super_admin"],
    }

    const generateTokenData: generateTokenInputType = {
        email: validationData.emailAddress,
        isAdmin:validationData.roles.includes("admin")
    }

    try {
        const token = await generateTokens(generateTokenData);
        const tokenResponse: tokenResponseType = {
            "accessToken": token.accessToken,
            "message": "Login Succeeded",
            "isAdmin": validationData.roles.includes("admin"),
            "isValid": true,
        }
        res.cookie('jwt', token.refreshToken,{
            httpOnly:true,
            secure: true,
            maxAge: 24*60*60*1000,
            sameSite: "none",
        });
        
        res.status(200).json(tokenResponse);
    } catch (err) {
        const tokenResponse: tokenResponseType = {
            "accessToken": "",
            "message": "Login unsuccessful",
            "isAdmin": false,
            "isValid": false,
        }

        res.status(500).json(tokenResponse);
    }
}

export async function signUp(req: Request, res: Response, next: NextFunction){
    const userInformation: userInformationType = req.body;

    if(!isValidRequestBody<userInformationType>(userInformation)){
        return res.status(400).json({error: "Invalid Request Body"});
    }

    const userEmail = userInformation.emailAddress;
    const isTheUserExist = await isUserExist(userEmail);
    console.log(isTheUserExist);
    if (isTheUserExist.isValid) {
        console.log("Existed");
        res.status(200).json({
            isExist: isTheUserExist.isValid,
            message: "Email is exists"
        })
    } else {
        console.log("Creating");
        try {
            const hashedPassword = hashPassword({
                plainTextPassword: userInformation.password,
                saltFactor: 10
            });
            userInformation.password = hashedPassword;
            //store
            const docName : string = userInformation.userName;
            await pushSignUpData<userInformationType>(userInformation, docName);
            res.status(200).json({
                isValid: true,
                message: "Email creation success",
            });
        } catch (err) {
            console.warn("Failed to hash or save to firestore");
            res.status(500).json({
                isValid: false,
                message: "Internal error, please tru again later",
            })
    }

    }

    // const isValid = comparePassword({
    //     plainTextPassword: userInformation.password,
    //     hashedPassword: hashedPassword,
    // })

    // console.log(isValid);



   
    // await firestore.collection("UserData").doc("credential").set({
    //     setEffect: {},
    //     inventory: [],
    //     coin: 0,
    //     totalValue: 0,
    //   }) 
}

export async function accessToken(req: Request, res: Response, next: NextFunction){;
    try {
        const tokenDetail= await verifyRefreshToken(req.cookies.jwt);
        const generateTokenData: generateTokenInputType = {
            email: tokenDetail._sub,
            isAdmin:tokenDetail._admin
        }
        const token = await generateTokens(generateTokenData);
        const tokenResponse: tokenResponseType = {
            "accessToken": token.accessToken,
            "message": tokenDetail.message,
            "isAdmin": tokenDetail._admin,
            "isValid": true,
        }
        res.status(200).json(tokenResponse);
    } catch (err) {
        const tokenResponse: tokenResponseType = {
            "accessToken": "",
            "message": "token request unsuccessful",
            "isAdmin": false,
            "isValid": false,
        }
        res.status(401).json(tokenResponse);
    }
}
