const initialState = {
  items: [],
  currentDialogId: window.location.pathname.split('dialog/')[1],
  isLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'DIALOGS:SET_ITEMS':
      return {
        ...state,
        items: payload,
      };
    case 'DIALOGS:SET_TYPING_IN_DIALOG':
      return {
        ...state,
        typingInDialogWithId: payload
    };
    case 'DIALOGS:LAST_MESSAGE_READ_STATUS':
      return {
        ...state,
        items: state.items.map(dialog => {
          if (dialog._id === payload.dialogId) {
            dialog.lastMessage.read = true;
          }
          return dialog;
        }),
      };
    case 'DIALOGS:SET_CURRENT_DIALOG_ID':
      return {
        ...state,
        currentDialogId: payload,
      };
    case 'DIALOGS:DELETE_DIALOG':
      return {
      ...state,
      items:state.items.filter(dialog => dialog._id !== payload)
      };
    case 'DIALOGS:SET_DIALOG_ONLINE':
      console.log('reducer: set online '+payload.fullName)
      return {
      ...state,
      online:payload
      };
    case 'DIALOGS:SET_DIALOG_OFFLINE':
      console.log('reducer: set offline '+payload.fullName)
      return {
      ...state,
      offline:payload
      };
    
    default:
      return state;
  }
};
