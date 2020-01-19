import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { Empty } from 'antd';
import find from 'lodash/find';

import { messagesActions, dialogsActions, userActions } from 'redux/actions';
import socket from 'core/socket';

import { Messages as BaseMessages } from 'components';

const Messages = ({
  currentDialog,
  fetchMessages,
  addMessage,
  items,
  user,
  isLoading,
  removeMessageById,
  attachments,
  me,
  setTypingInDialogWithId,
}) => {
  if (!currentDialog) {

    return <Empty description="Откройте диалог" />;
    
  }
  let typingInDialogWithId = useSelector(state => state.dialogs.typingInDialogWithId)
  let allMessages = useSelector(state => state.messages.allItems)
  
  
  const [previewImage, setPreviewImage] = useState(null);
  const [blockHeight, setBlockHeight] = useState(135);
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeoutId = null;

  const messagesRef = useRef(null);

  const onNewMessage = data => {
    addMessage(data);
  };
  const toggleIsTyping = (obj) => {
    setTypingInDialogWithId(obj.dialogId)
    setIsTyping(true);
    clearInterval(typingTimeoutId);
    typingTimeoutId = setTimeout(() => {
      setIsTyping(false);
      setTypingInDialogWithId(undefined)
    }, 2000);
  };

  useEffect(() => {
    socket.on('DIALOGS:TYPING', (obj) => toggleIsTyping(obj));    
  }, []);

  useEffect(() => {
    if (attachments.length) {
      setBlockHeight(245);
    } else {
      setBlockHeight(135);
    }
  }, [attachments]);

  useEffect(() => {
    if (currentDialog) {
      let itsMessages;
      if (allMessages) {
        itsMessages = allMessages.filter(m => m.dialog === currentDialog._id)
      }
      
      fetchMessages(currentDialog,itsMessages);
    }
   
    socket.on('SERVER:NEW_MESSAGE', onNewMessage);

    return () => socket.removeListener('SERVER:NEW_MESSAGE', onNewMessage);
  }, [currentDialog]);

  useEffect(() => {
    messagesRef.current.scrollTo(0, 999999);
  }, [items, isTyping]);

  return (
    <BaseMessages
      user={user}
      me={me}
      blockRef={messagesRef}
      items={items}
      isLoading={isLoading && !user}
      onRemoveMessage={removeMessageById}
      setPreviewImage={setPreviewImage}
      previewImage={previewImage}
      blockHeight={blockHeight}
      isTyping={isTyping}
      currentDialog={currentDialog}
      typingInDialogWithId={typingInDialogWithId}
      partner={
        user._id === currentDialog.partner._id ? currentDialog.author : currentDialog.partner
      }
    />
  );
};

export default connect(
  ({ dialogs, messages, user, attachments }) => ({
    currentDialog: find(dialogs.items, { _id: dialogs.currentDialogId }),
    items: messages.items,
    isLoading: messages.isLoading,
    attachments: attachments.items,
    date: messages.date,
    user: user.data,
  }),
  {...messagesActions, ...dialogsActions, userActions}
)(Messages);
