import express from 'express';
import bcrypt from 'bcrypt';
import socket from 'socket.io';
import { validationResult } from 'express-validator';
import mailer from '../core/mailer';
import mongoose from 'mongoose';

import { UserModel } from '../models';
import { IUser } from '../models/User';
import { createJWToken } from '../utils';

class UserController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }

  show = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      res.json(user);
    });
  };

  getMe = (req: any, res: express.Response) => {
    const id: string = req.user && req.user._id;
    UserModel.findById(id, (err, user: any) => {
      if (err || !user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      res.json(user);
    });
  };

  findUsers = (req: any, res: express.Response) => {
    const query: string = req.query.query;
    UserModel.find()
      .or([
        { fullName: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') }
      ])
      .then((users: any) => res.json(users))
      .catch((err: any) => {
        return res.status(404).json({
          status: 'error',
          message: err
        });
      });
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    UserModel.findOneAndRemove({ _id: id })
      .then(user => {
        if (user) {
          res.json({
            message: `User ${user.fullName} deleted`
          });
        }
      })
      .catch(() => {
        res.json({
          message: `User not found`
        });
      });
  };
  setOnline = (req: express.Request, res: express.Response) => {
    const id: string = req.body._id;
    UserModel.findOne({ '_id': id})
    .then(user => {
  
      if (user) {
        user.isOnline = true
        user.last_seen=new Date()
        user.save()
        .then(() => res.json({message: 'User is online'}))
        .catch((err) => console.log(err))
      }
    })
    .catch((err) => {
      console.log(err)
      res.json({
        message: err
      });
    });
  }
  setOffline = (req: express.Request, res: express.Response) => {
    const id: string = req.body._id;
    UserModel.findOne({ _id: id})
    .then(user => {
  
      if (user) {
        user.isOnline = false
        user.last_seen=new Date()
        user.save()
        .then(() => res.json({message: 'User is offline'}))
        .catch((err) => console.log(err))
      }
    })
    .catch((err) => {
      console.log(err)
      res.json({
        message: err
      });
    });
  }
  setAvatar = (req: express.Request, res: express.Response) => {
    const id: string = req.body._id;
    const avatar: string = req.body.avatar
    UserModel.findOne({ _id: id})
    .then(user => {
  
      if (user) {
        user.avatar = avatar
        user.save()
        .then(() => res.json({message: 'Avatar is set'}))
        .catch((err) => console.log(err))
      }
    })
    .catch((err) => {
      console.log(err)
      res.json({
        message: `ound`
      });
    });
  }
  setCurrentDialog = (req: express.Request, res: express.Response) => {
    const id: string = req.body._id;
    const current_dialog_id: string = req.body.current_dialog_id;

    UserModel.findOne({ _id: id }, (err: any, user: IUser) => {
      if (err || !user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      user.current_dialog_id = current_dialog_id 
      user.save()
        .then(() => res.json({message: 'Current dialog is set'}))
        .catch((err) => console.log(err))
  })
}
  create = (req: express.Request, res: express.Response) => {
    const postData = {
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new UserModel(postData);

    user
      .save()
      .then((obj: any) => {
        res.json(obj);
        mailer.sendMail(
          {
            from: 'Small Chat',
            to: postData.email,
            subject: 'Подтверждение почты в чате',
            html: `<html>
            <head>
              <style>
                .content {
                  padding-top: 100px;
                  height: 520px;
                  border-radius: 8px;
                  width: 550px;
                  background: rgb(155,111,155);
                  background-repeat: no-repeat;
                  background: -webkit-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), linear-gradient(to bottom,            rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), linear-gradient(135deg,  #670d10 0%,#092756 100%);  
                  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3E1D6D', endColorstr='#092756',GradientType=1 );
                  font-family: 'Arial','Roboto','Open Sans',serif;
                  text-align: center;
                  
                }
                h1 {
                   color: rgb(256,124,115) !important;
                  text-align: center;
                }
                p {
                  color: rgba(210,210,210,1);
                  font-size: 20px;
                }
                .button {
                  width: 170px;
                  height: 20px;
                  margin-left: 180px;
                  background: rgba(255,255,255,.9);
                  border-radius: 9px;
                  padding: 8px;
                  padding-bottom: 15px;
                   background: -webkit-radial-gradient(0% 200%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 100%), linear-gradient(to bottom,            rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), linear-gradient(135deg,  #670d10 0%,#092756 100%);  
                  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3E1D6D', endColorstr='#092756',GradientType=1 );
            
                }
               
                .link a {
                  color: rgb(256,144,115) !important;
                  text-decoration: none;
                  font-size: 20px;
                 
                }
           
                .button:hover {
                  background: -webkit-radial-gradient(200% 255%, ellipse cover, rgba(104,128,238,.4) 10%,rgba(138,114,76,0) 100%), linear-gradient(to bottom,            rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), linear-gradient(135deg,  #670d10 0%,#092756 100%);  
                  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3E1D6D', endColorstr='#092756',GradientType=1 );
                }
                
            </style>
            </head>
          <body>
            <div class='content'>
          <h1>Привет, ${obj.fullName}!</h1>
             <p>Добро пожаловать в чатик!</p>
            <p>Я очень рад что ты решил(а) зарегистрироваться!</p>
            <p>Почта подтверждена!<p>
            <div class='button'>
              <span class='link'><a href="https://ordinary-chat.herokuapp.com/signup/verify?hash=${obj.confirm_hash}">Вернуться в чат</a></span>
            </div>
            </div>
          </body>
          </html>`
          },
          function(err: any, info: any) {
            if (err) {
              console.log(err);
            } else {
              console.log(info);
            }
          }
        );
      })
      .catch(reason => {
        res.status(500).json({
          status: 'error',
          message: reason
        });
      });
  };
 
  verify = (req: express.Request, res: express.Response) => {
    const hash = req.query.hash;

    if (!hash) {
      return res.status(422).json({ errors: 'Invalid hash' });
    }

    UserModel.findOne({ confirm_hash: hash }, (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'Hash not found'
        });
      }

      user.confirmed = true;
      user.save(err => {
        if (err) {
          return res.status(404).json({
            status: 'error',
            message: err
          });
        }

        res.json({
          status: 'success',
          message: 'Аккаунт успешно подтвержден!'
        });
      });
    });
  };

  login = (req: express.Request, res: express.Response) => {
    const postData = {
      email: req.body.email,
      password: req.body.password
    };
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    UserModel.findOne({ email: postData.email }, (err, user: IUser) => {
      if (err || !user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      if (bcrypt.compareSync(postData.password, user.password)) {
        const token = createJWToken(user);
        res.json({
          status: 'success',
          token
        });
      } else {
        res.status(403).json({
          status: 'error',
          message: 'Incorrect password or email'
        });
      }
    });
  };
}

export default UserController;
