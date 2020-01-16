import { dialogsApi } from 'utils/api';
import socket from 'core/socket';

const Actions = {
  setDialogs: items => ({
    type: 'DIALOGS:SET_ITEMS',
    payload: items,
  }),
  setTypingInDialogWithId: id => ({
    type: 'DIALOGS:SET_TYPING_IN_DIALOG',
    payload: id
  }),
  setDialogOnline: user => ({
    type: 'DIALOGS:SET_DIALOG_ONLINE',
    payload: user
  }),
  setDialogOffline: user => ({
    type: 'DIALOGS:SET_DIALOG_OFFLINE',
    payload: user
  }),
  updateReadStatus: ({ userId, dialogId }) => {
   
    return({
    type: 'DIALOGS:LAST_MESSAGE_READ_STATUS',
    payload: {
      userId,
      dialogId,
    },
  })},
  setCurrentDialogId: id => dispatch => {
    socket.emit('DIALOGS:JOIN', id);
    dispatch({
      type: 'DIALOGS:SET_CURRENT_DIALOG_ID',
      payload: id,
    });
  },
  fetchDialogs: () => dispatch => {
    dialogsApi.getAll().then(({ data }) => {
      dispatch(Actions.setDialogs(data));
    });
  },
  deleteDialog: id => dispatch => {
    dialogsApi.delete(id)
    dispatch({
      type: 'DIALOGS:DELETE_DIALOG',
      payload: id,
    });
  }
};

export default Actions;
