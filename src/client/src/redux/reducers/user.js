const initialState = {
  data: null,
  token: window.localStorage.token,
  isAuth: !!window.localStorage.token
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "USER:SET_DATA":
      return {
        ...state,
        data: payload,
        isAuth: true,
        token: window.localStorage.token
      };
    case "USER:SET_AVATAR":
      return {
        ...state,
        data: {...state.data,
          avatar:payload.avatar},
      };
    case "USER:SET_IS_AUTH":
      return {
        ...state,
        isAuth: payload
      };
    case "USER:SET_ONLINE":
      return {
        ...state,
        data: {...state.data,
          last_seen:new Date(),isOnline:true},
      };
    case "USER:SET_CURRENT_DIALOG":
      return {
        ...state,
        data: {...state.data,
          current_dialog_id:payload},
      };
    case "USER:SET_OFFLINE":
      return {
        ...state,
        data: {...state.data,
          last_seen:new Date(),isOnline:false},
      };
    default:
      return state;
  }
};
