import { NextFunction, Request, Response } from "express";
import {
  isEmailFormat,
  isUserExist,
  isValidRequestBody,
  pushSignUpData,
  userDataColDocName,
  userVerification,
} from "./helper/generalModelHelper";
import { generateTokens, verifyRefreshToken } from "./helper/TokenModel";
import {
  generateTokenInputType,
  tokenResponseType,
} from "./config/TokenModelConfig";
import { firestore } from "../Utility/Firestore/Firestore";
import { userInformationType } from "./config/UserDataConfig";
import { comparePassword, hashPassword } from "./helper/HashModel";
import { loginTokenBodyType } from "./config/generalModelHeperConfig";
import { comparePasswordInputType } from "./config/HashModelConfig";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const Payload: loginTokenBodyType = req.body;

    if (!isValidRequestBody<loginTokenBodyType>(Payload)) {
      return res.status(400).json({ error: messageList.InvalidBodyRequest });
    }

    const verifiedIdentity = await userVerification(Payload);

    if (!verifiedIdentity.isValid) {
      return res.status(404).json(messageList.UserNotFound);
    }

    const isPasswordMatch = comparePassword({
      hashedPassword: verifiedIdentity.userData.password,
      plainTextPassword: Payload.password,
    });

    if (!isPasswordMatch) {
      return res.status(400).json(messageList.InvalidPassword);
    }

    const validatedData = {
      emailAddress: verifiedIdentity.userData.emailAddress,
      roles: verifiedIdentity.userData.roles,
    };

    const generateTokenData: generateTokenInputType = {
      email: validatedData.emailAddress,
      isAdmin: validatedData.roles.includes("admin"),
    };

    const token = await generateTokens(generateTokenData);
    const tokenResponse: tokenResponseType = {
      accessToken: token.accessToken,
      message: messageList.LoginSuccesful,
      isAdmin: validatedData.roles.includes("admin"),
      isValid: true,
    };
    res.cookie("jwt", token.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 0.15 * 60 * 60 * 1000,
      sameSite: "none",
    });

    res.status(200).json(tokenResponse);
  } catch (err) {
    const tokenResponse: tokenResponseType = {
      accessToken: "",
      message: messageList.LoginFailed,
      isAdmin: false,
      isValid: false,
    };

    res.status(500).json(tokenResponse);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const userInformation: userInformationType = req.body;

  if (!isValidRequestBody<userInformationType>(userInformation)) {
    return res.status(400).json({ error: messageList.InvalidBodyRequest });
  }

  const userEmail = userInformation.emailAddress;
  const userName = userInformation.userName;

  if (
    userEmail === null ||
    userEmail.length === 0 ||
    userName === null ||
    userName.length === 0
  ) {
    return res.status(400).json({ error: "Email or username is empty" });
  }

  const isAEmailFormat = isEmailFormat(userEmail);

  if (!isAEmailFormat)
    return res.status(400).json({ error: "Email not in correct format" });

  const isTheUserExist = await isUserExist(userEmail);

  if (isTheUserExist.isValid) {
    console.log("Existed");
    res.status(200).json({
      isExist: isTheUserExist.isValid,
      message: messageList.EmailIsRegistered,
    });
  } else {
    console.log("Creating");
    try {
      const hashedPassword = hashPassword({
        plainTextPassword: userInformation.password,
        saltFactor: 10,
      });
      userInformation.password = hashedPassword;
      userInformation.roles = ["user"];
      //store
      await pushSignUpData<userInformationType>(userInformation, userEmail);
      res.status(200).json({
        isValid: true,
        message: "Email creation success",
      });
    } catch (err) {
      console.warn("Failed to hash or save to firestore");
      res.status(500).json({
        isValid: false,
        message: "Internal error, please tru again later",
      });
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

export async function accessToken(
  req: Request,
  res: Response,
  _: NextFunction
) {
  try {
    const tokenDetail = await verifyRefreshToken(req.cookies.jwt);
    const generateTokenData: generateTokenInputType = {
      email: tokenDetail._sub,
      isAdmin: tokenDetail._admin,
    };
    const token = await generateTokens(generateTokenData);
    const tokenResponse: tokenResponseType = {
      accessToken: token.accessToken,
      message: tokenDetail.message,
      isAdmin: tokenDetail._admin,
      isValid: true,
    };
    res.status(200).json(tokenResponse);
  } catch (err) {
    const tokenResponse: tokenResponseType = {
      accessToken: "",
      message: "token request unsuccessful",
      isAdmin: false,
      isValid: false,
    };
    res.status(401).json(tokenResponse);
  }
}
