import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';

import { dialogsActions, messagesActions} from 'redux/actions';
import socket from 'core/socket';
import { Dialogs as BaseDialogs } from 'components';
import { userApi, dialogsApi, messagesApi } from '../utils/api';

const Dialogs = ({ fetchDialogs, updateReadStatus, currentDialogId, items, userId, user, setAllMessages }) => {
 
  let all =useSelector(state => state.messages.allItems)

  const [inputValue, setValue] = useState('');
  const [filtered, setFilteredItems] = useState(Array.from(items));

  
  const onSetAllMessages = (dialogs ) => {
   
    messagesApi.getAll()
    .then(res => {
      let messages = []
      dialogs.forEach(dialog => {
        messages.push(res.data.filter(m => m.dialog === dialog._id))
      })
      messages = [].concat.apply([],messages)
     
        setAllMessages(messages)
  })
  }
  const onChangeInput = (value = '') => {
    setFilteredItems(
      items.filter(
        dialog => 
          dialog && dialog.author && dialog.partner && (dialog.author.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          dialog.partner.fullName.toLowerCase().indexOf(value.toLowerCase()) >= 0),
      ),
    );
    setValue(value);
  };

  window.fetchDialogs = fetchDialogs;
 
  if (filtered && filtered.length && userId) {
    
    filtered.forEach(item => {
      if (item) {
          
         
          item.partner = item.partner._id === userId? item.author : item.partner 
          // dialog partner is never me
      }
     
    })
  }
  useEffect(() => {
    socket.on('USER:ONLINE',() => console.log('online'))
    socket.on('USER:OFFLINE',() => console.log('offline'))
  })
  useEffect(() => {
    if (items.length) {
      onChangeInput();
      if (!all || !all.length)
      onSetAllMessages(items)
    }
  }, [items]);

  useEffect(() => {
    fetchDialogs();
    socket.on('SERVER:DIALOG_CREATED', fetchDialogs);
    socket.on('SERVER:NEW_MESSAGE', fetchDialogs);
    socket.on('SERVER:MESSAGES_READ', updateReadStatus);
    socket.on('SERVER:ONLINE', fetchDialogs);
    socket.on('SERVER:OFFLINE', fetchDialogs);
    
    
    return () => {
      socket.removeListener('SERVER:DIALOG_CREATED', fetchDialogs);
      socket.removeListener('SERVER:NEW_MESSAGE', fetchDialogs);
    };
  }, []);
  return (
    <BaseDialogs
      userId={userId}
      items={filtered}
      onSearch={onChangeInput}
      inputValue={inputValue}
      currentDialogId={currentDialogId}
    />
  );
};

export default connect(
  ({ dialogs }) => dialogs,
  {...dialogsActions, ...messagesActions}
)(Dialogs);
