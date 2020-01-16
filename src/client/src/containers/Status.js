import React from "react";
import { Status as StatusBase } from "components";
import { connect } from "react-redux";
import { userActions,dialogsActions,messagesActions } from 'redux/actions'
import {useMediaQuery } from 'react-responsive'

const Status = props => {
  let { currentDialogId,
    user,
    dialogs,
    deleteDialog,
    history,
    setCurrentDialogId,
    clearMessages
    
  } = props
  
  const isMobile = useMediaQuery({ maxWidth: 767 })



  const goBack = () => {
    let sidebar = document.querySelector('.chat__sidebar')
    sidebar.style.display = 'block'
    history.push('/')
    clearMessages()
    
  }
  const deleteDialogById = (id) => {
    deleteDialog(id)
    history.push('/')
    if (isMobile) goBack()
  }

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
