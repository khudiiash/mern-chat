import React, { useEffect } from "react";
import { Status as StatusBase } from "components";
import { connect, useSelector } from "react-redux";
import socket from 'core/socket'
import { userActions,dialogsActions,messagesActions } from 'redux/actions'
import {useMediaQuery } from 'react-responsive'

const Status = props => {
  let { currentDialogId,
    user,
    dialogs,
    deleteDialog,
    history,
    updateFriendsOnline,
    setCurrentDialogId,
    clearMessages
    
  } = props
  let friends = useSelector(state => state.dialogs.friends)
  const isMobile = useMediaQuery({ maxWidth: 767 })


  const updateOnlineStatus = (friends,user,isOnline) => {
    let friend = friends.find(f => f._id === user._id)
    if (friend) {
      friends[friends.indexOf(friend)].isOnline = isOnline
      updateFriendsOnline(friends)
    }
   
  }
  const goBack = () => {
    let sidebar = document.querySelector('.chat__sidebar')
    sidebar.style.display = 'block'
    setCurrentDialogId('')
    clearMessages()
  }
  const deleteDialogById = (id) => {
    deleteDialog(id)
    history.push('/')
    if (isMobile) goBack()
  }
  useEffect(() => {
    socket.on('USER:ONLINE', user => {
      if (friends) updateOnlineStatus(friends,user,true)
      
    })
    socket.on('USER:OFFLINE', user => {
      if (friends) updateOnlineStatus(friends,user,false)
    })
  })

  if (!dialogs.length || !currentDialogId) {
    return null;
  }

  const currentDialogObj = dialogs.filter(
    dialog => dialog._id === currentDialogId
  )[0];

  let partner = {};
  if (currentDialogObj) {
    if (currentDialogObj.author._id === user._id) {
      partner = currentDialogObj.partner;
    } else {
      partner = currentDialogObj.author;
    }
  }


  return <StatusBase partner={partner} deleteDialogById={deleteDialogById} goBack={goBack} />;
};

export default connect(({ dialogs, user }) => ({
  dialogs: dialogs.items,
  currentDialogId: dialogs.currentDialogId,
  user: user.data
}), { ...dialogsActions, ...userActions,...messagesActions },
)(Status);
