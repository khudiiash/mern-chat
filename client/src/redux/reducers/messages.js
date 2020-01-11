const initialState = {
  items: [],
  isLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'MESSAGES:ADD_MESSAGE':
      return {
        ...state,
        items: [...state.items, payload],
      };
    case 'MESSAGES:SET_ALL_ITEMS':
      return {
        ...state,
        allItems: payload,
        isLoading: false,
      };
    case 'MESSAGES:SET_ITEMS':
      return {
        ...state,
        items: payload,
        isLoading: false,
      };
    case 'DIALOGS:LAST_MESSAGE_READ_STATUS':
      return {
        ...state,
        items: state.items.map(message => {
          if (message.dialog._id === payload.dialogId) {
            message.read = true;
          }
          return message;
        }),
      };
    case 'MESSAGES:REMOVE_MESSAGE':
      return {
        ...state,
        items: state.items.filter(message => message._id !== payload),
      };
    case 'MESSAGES:SET_IS_LOADING':
      return {
        ...state,
        isLoading: payload,
      };
    default:
      return state;
  }
};