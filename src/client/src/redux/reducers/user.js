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
    case "USER:SET_CURRENT_DIALOG":
      return {
        ...state,
        offline:  [...state.user.offline, payload._id]
      };
    
    default:
      return state;
  }
};
