import { Router } from "express";
import { login, accessToken, signUp } from "../model/AuthRouteModel";

export const authRouteController = async (router: Router) => {
  router.post("/login", login);
  router.post("/signup", signUp);
  router.post("/token", accessToken);
};
