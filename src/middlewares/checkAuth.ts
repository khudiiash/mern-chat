import express from "express";
import { verifyJWTToken } from "../utils";
import { IUser } from "../models/User";
import path from 'path'

export default (req: any, res: any, next: any) => {
  if (
    req.path === "/user/signin" ||
    req.path === "/user/signup" ||
    req.path === "/user/verify"
  ) {
    return next();
  }

  const token = req.headers.token;


  verifyJWTToken(token)
  .then((user: any) => {
    req.user = user.data._doc;
    next();
  })
  .catch(err => {
    res.sendFile(path.resolve(__dirname + '/../client/build/index.html'));
  });  
};
