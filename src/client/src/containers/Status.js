import React from "react";
import { Status as StatusBase } from "components";
import { connect } from "react-redux";
import { dialogsActions } from 'redux/actions'

const Status = props => {
  let { currentDialogId, 
    user, 
    dialogs,
    deleteDialog,
    history
  } = props

  const deleteDialogById = (id) => {
    deleteDialog(id)
    history.push('/')
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
 

  return <StatusBase partner={partner} deleteDialogById={deleteDialogById} />;
};

export default connect(({ dialogs, user }) => ({
  dialogs: dialogs.items,
  currentDialogId: dialogs.currentDialogId,
  user: user.data
}),{ ...dialogsActions },
)(Status);
