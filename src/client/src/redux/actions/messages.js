import { messagesApi } from "utils/api";
import { useSelector } from "react-redux";

const Actions = {
  setAllMessages: items =>  ({
    type: "MESSAGES:SET_ALL_ITEMS",
    payload: items
  }),
  setMessages: items => ({
    type: "MESSAGES:SET_ITEMS",
    payload: items
  }),
  cacheMessages: (id,items) => ({
    type: "DIALOGS:CACHE_MESSAGES",
    payload: {id,items}
  }),
  clearMessages: () => ({
    type: "MESSAGES:SET_ITEMS",
    payload: []
  }),
  addMessage: message => (dispatch, getState) => {
    const { dialogs } = getState();
    const { currentDialogId } = dialogs;

    if (currentDialogId === message.dialog._id) {
      dispatch({
        type: "MESSAGES:ADD_MESSAGE",
        payload: message
      });
    }
  },
  fetchSendMessage: ({ text, dialogId, attachments }) => dispatch => {
    return messagesApi.send(text, dialogId, attachments);
  },
  setIsLoading: bool => ({
    type: "MESSAGES:SET_IS_LOADING",
    payload: bool
  }),
  removeMessageById: id => dispatch => {
   
      messagesApi
        .removeById(id)
        .then(({ data }) => {
          dispatch({
            type: "MESSAGES:REMOVE_MESSAGE",
            payload: id
          });
        })
        .catch(() => {
          dispatch(Actions.setIsLoading(false));
        });
  },

  fetchMessages: (dialog, itsMessages) => dispatch => {
      if (dialog.cache && itsMessages && dialog.cache.length === itsMessages.length) {
        dispatch(Actions.setMessages(dialog.cache));
      } else {
        dispatch(Actions.setIsLoading(true));
        messagesApi
          .getAllByDialogId(dialog._id)
          .then(({ data }) => {
            if (itsMessages) {
              
            }
           
            dispatch(Actions.setMessages(data));
            dispatch(Actions.cacheMessages(dialog._id,data))
          })
          .catch(() => {
            dispatch(Actions.setIsLoading(false));
          });
      }
           
  },
 
};

export default Actions;
