import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';

import { dialogsActions, messagesActions} from 'redux/actions';
import socket from 'core/socket';
import { Dialogs as BaseDialogs } from 'components';
import { userApi, dialogsApi, messagesApi } from '../utils/api';

const Dialogs = ({ fetchDialogs, updateReadStatus, currentDialogId, items, userId, user, setAllMessages, setFriends }) => {
  let friends = useSelector(state => state.dialogs.friends) || []
  if (items && !friends.length) {
    items.forEach(dialog => {
      friends.push(userId === dialog.author ? dialog.partner : dialog.author)
    })
    if (friends.length) {
      setFriends(friends)
    }
  }
  if ( user && currentDialogId ) {
    dialogsApi.getOneById(currentDialogId)
      .then(res => {
        if ( user.current_dialog_id !== currentDialogId) {
          user.current_dialog_id = currentDialogId
          if (res.data.author === user._id) {
            user.receiver_id = res.data.partner
          } else if (res.data.partner === user._id) {
            user.receiver_id = res.data.author
          }
            userApi.setCurrentDialog(user)
        }
        
      })
  }
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
 

  useEffect(() => {
    if (items.length) {
      onChangeInput();
      onSetAllMessages(items)
    }
  }, [items]);

  useEffect(() => {
    fetchDialogs();
    socket.on('SERVER:DIALOG_CREATED', fetchDialogs);
    socket.on('SERVER:NEW_MESSAGE', fetchDialogs);
    socket.on('SERVER:MESSAGES_READ', updateReadStatus);
    
    
    return () => {
      socket.removeListener('SERVER:DIALOG_CREATED', fetchDialogs);
      socket.removeListener('SERVER:NEW_MESSAGE', fetchDialogs);
    };
  }, []);
  return (
    <BaseDialogs
      friends={friends}
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
