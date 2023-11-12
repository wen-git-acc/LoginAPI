import {
  jwtPayloadType,
  generateTokenInputType,
  jwtFullPayloadType,
} from "../config/TokenModelConfig";
require("dotenv").config();
import * as jwt from "jsonwebtoken";

export const generateTokens = ({ email, isAdmin }: generateTokenInputType) => {
  const jwtIssuerEmail = "fangwenjwt@xyz.com";
  const jwtAudEmail = "frontend@xyz.com";
  try {
    const jwtPayload: jwtPayloadType = {
      _iss: jwtIssuerEmail,
      _aud: jwtAudEmail,
      _sub: email,
      _admin: isAdmin,
    };

    const accessToken: string = jwt.sign(
      jwtPayload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      { expiresIn: "15m" }
    );

    const refreshToken: string = jwt.sign(
      jwtPayload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY!,
      { expiresIn: "7d" }
    );
    const dateGenerated = new Date();
    console.log(dateGenerated.toTimeString());
    console.log(dateGenerated.getHours());
    return Promise.resolve({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    console.log(process.env.REFRESH_TOKEN_PRIVATE_KEY!);
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY!
    ) as jwtFullPayloadType;
    return Promise.resolve({
      ...decodedToken,
      error: false,
      message: "Valid refresh token",
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
