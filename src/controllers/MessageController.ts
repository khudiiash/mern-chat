import express from 'express';
import socket from 'socket.io';
import mongoose from 'mongoose'

import { MessageModel, DialogModel, UserModel } from '../models';
import { IUser } from '../models/User';
import { IMessage } from '../models/Message';
import mailer from '../core/mailer';


class MessageController {
  io: socket.Server;

  constructor(io: socket.Server) {
    this.io = io;
  }
  sendMailOnMessage = (receiverId: any, senderId: any, message: any) => {
    UserModel.find({'_id':{ $in : [
      mongoose.Types.ObjectId(receiverId),
      mongoose.Types.ObjectId(senderId)
    ]}}, (err,docs) => {
      if (err) {
        console.log(err)
      }
      
      let sender,receiver;
      if (docs && docs[0]) receiver = docs[0]
      if (docs && docs[1]) sender = docs[1]
     
          if (!err && sender && receiver && !receiver.isOnline) {
        mailer.sendMail(
          {
            from: 'Ordinary Chat',
            to: receiver.email,
            subject: 'Ordinary Chat: New Message',
            html: `<html>
            <head>
              <style>
                .content {
                  padding-top: 100px;
                  height: 420px;
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
                h3 {
                  color: rgb(256,124,115) !important;
                  font-size: 20px;
                }
                h4 {
                  color: rgb(150,150,150) !important;
                }
                h4 span {
                  color: rgb(256,124,115) !important;
                  font-size: 20px;
                }
                .button {
                  margin-top: 50px;
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
          <h1>Привет, ${receiver.fullName}!</h1>
             <h4>Для тебя есть новое сообщение от <span>${sender.fullName}</span></h4>
            <h3>${message.text ? `"${message.text}"`:''}</h3>
            <div class='button'>
              <span class='link'><a href="https://ordinary-chat.herokuapp.com">Перейти в чат</a></span>
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
      }
    })
    
  }
  updateReadStatus = (res: express.Response, userId: string, dialogId: string) => {
   
    MessageModel.updateMany(
      { dialog: dialogId, user: { $ne: userId } },
      { $set: { read: true } },
      (err: any) => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            message: err,
          });
        }
        this.io.emit('SERVER:MESSAGES_READ', {
          userId,
          dialogId,
        });
      },
    );
    
  };
  getAll = (req: express.Request, res: express.Response) => {
    MessageModel.find({}, (err: any,messages: IMessage) => {
      res.send(messages)
    })
  }
  index = (req: express.Request, res: express.Response) => {
    const dialogId: string = req.query.dialog;
    const userId = req.user._id;
   
    UserModel.findOne({_id:userId},(err:any, user: IUser) => {
      if (err || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
      }
        let currentDialogId = user.current_dialog_id
        if (currentDialogId) {
          this.updateReadStatus(res, userId, dialogId);
        }
      
    })
    
    

    

    MessageModel.find({ dialog: dialogId })
      .populate(['dialog', 'user', 'attachments'])
      .exec(function(err, messages) {
        if (err) {
          return res.status(404).json({
            status: 'error',
            message: 'Messages not found',
          });
        }
        return res.json(messages);
      });
  };

  create = (req: any, res: express.Response) => {
    const userId = req.user._id;

    const postData = {
      text: req.body.text,
      dialog: req.body.dialog_id,
      attachments: req.body.attachments,
      user: userId,
    };

    const message = new MessageModel(postData);

    this.updateReadStatus(res, userId, req.body.dialog_id);

    message
      .save()
      .then((obj: any) => {
        obj.populate(['dialog', 'user', 'attachments'], (err: any, message: any) => {
          if (err) {
            return res.status(500).json({
              status: 'error',
              message: err,
            });
          }

          DialogModel.findOneAndUpdate(
            { _id: postData.dialog },
            { lastMessage: message._id },
            { upsert: true },
            function(err) {
              if (err) {
                return res.status(500).json({
                  status: 'error',
                  message: err,
                });
              }
            },
          );

          res.json(message);

          this.io.emit('SERVER:NEW_MESSAGE', message);
        });
      })
      .catch(reason => {
        res.json(reason);
      });
      DialogModel.findById(req.body.dialog_id, (err,dialog) => {
        if (!err && dialog) {
          let receiverId = message.user.toString() === dialog.author.toString() ? dialog.partner.toString() : dialog.author.toString()
          this.sendMailOnMessage(receiverId,userId,message)
        }
      })
    
  };

  delete = (req: express.Request, res: express.Response) => {
    const id: string = req.query.id;
    const userId: string = req.user._id;

    MessageModel.findById(id, (err, message: any) => {
      if (err || !message) {
        return res.status(404).json({
          status: 'error',
          message: 'Message not found',
        });
      }

      if (message.user.toString() === userId) {
        const dialogId = message.dialog;
        message.remove();

        MessageModel.findOne(
          { dialog: dialogId },
          {},
          { sort: { createdAt: -1 } },
          (err, lastMessage) => {
            if (err) {
              res.status(500).json({
                status: 'error',
                message: err,
              });
            }

            DialogModel.findById(dialogId, (err, dialog: any) => {
              if (err) {
                res.status(500).json({
                  status: 'error',
                  message: err,
                });
              }

              dialog.lastMessage = lastMessage;
              dialog.save();
            });
          },
        );

        return res.json({
          status: 'success',
          message: 'Message deleted',
        });
      } else {
        return res.status(403).json({
          status: 'error',
          message: 'Not have permission',
        });
      }
    });
  };
}

export default MessageController;
