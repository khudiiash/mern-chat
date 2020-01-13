import bodyParser from "body-parser";
import express from "express";
import socket from "socket.io";
import { updateLastSeen, checkAuth } from "../middlewares";
import { loginValidation, registerValidation } from "../utils/validations";
import path from "path";

import multer from "./multer";

import {
  UserCtrl,
  DialogCtrl,
  MessageCtrl,
  UploadFileCtrl
} from "../controllers";

const createRoutes = (app: express.Express, io: socket.Server) => {
  const UserController = new UserCtrl(io);
  const DialogController = new DialogCtrl(io);
  const MessageController = new MessageCtrl(io);
  const UploadFileController = new UploadFileCtrl();

  app.use(bodyParser.json());
  app.use(checkAuth)
  app.use(updateLastSeen);
  
  app.get("/user/me", UserController.getMe);
  app.get("/user/verify", UserController.verify);
  app.post("/user/signup", registerValidation, UserController.create);
  app.post("/user/signin", loginValidation, UserController.login);
  app.post("/user/setAvatar", UserController.setAvatar);
  app.post("/user/setOnline", UserController.setOnline);
  app.post("/user/setOffline", UserController.setOffline);
  app.post("/user/setCurrentDialog",UserController.setCurrentDialog)
  app.get("/user/find", UserController.findUsers);
  app.get("/user/:id", UserController.show);
  app.delete("/user/:id", UserController.delete);

  app.get("/dialogs", DialogController.index);
  app.get("/dialogs/:id", DialogController.getOneById);
  app.delete("/dialogs/:id", DialogController.delete);
  app.post("/dialogs", DialogController.create);

  app.get("/messages/get-all", MessageController.getAll);
  app.get("/messages", MessageController.index);
  app.post("/messages", MessageController.create);
  app.delete("/messages", MessageController.delete);

  app.post("/files", multer.single("file"), UploadFileController.create);
  app.delete("/files", UploadFileController.delete);
};

export default createRoutes;
