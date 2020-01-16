import socket from 'socket.io';
import http from 'http';
import {UserModel} from '../models'

export default (http: http.Server) => {
  const io = socket(http);

  io.on('connection', function(socket: any) {
    let currentUser: any;
  
    socket.on('USER:ONLINE', (user: any) => {
      if (user) {
        socket.broadcast.emit('USER:ONLINE', user)
        currentUser = user
        UserModel.findOne(
          {_id: user._id},
          (err: any, user: any) => {
            if (!err) {
             user.last_seen = new Date()
             user.save()
            }
          }
        )

      }
    });
    socket.on('disconnect',() => {
      if (currentUser) {
        socket.broadcast.emit('USER:OFFLINE', currentUser)
        UserModel.findOne(
          {_id: currentUser._id},
          (err: any, user: any) => {
            if (!err) {
             user.last_seen = new Date()
             user.save()
            }
          }
        )
      }
    });
    
    socket.on('DIALOGS:JOIN', (dialogId: string) => {
      socket.dialogId = dialogId;
      socket.join(dialogId);
    });
    socket.on('DIALOGS:TYPING', (obj: any) => {
      socket.broadcast.emit('DIALOGS:TYPING', obj);
    });
  });

  return io;
};

