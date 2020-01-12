import { axios } from "core";

export default {
  signIn: postData => axios.post("/user/signin", postData),
  signUp: postData => axios.post("/user/signup", postData),
  verifyHash: hash => axios.get("/user/verify?hash=" + hash),
  getMe: () => axios.get("/user/me"),
  findUsers: query => axios.get("/user/find?query=" + query),
  setAvatar: data =>  axios.post("/user/setAvatar", data),
  setOnline: data => axios.post("/user/setOnline", data),
  setOffline: data =>  axios.post("/user/setOffline", data),
  setCurrentDialog: data => axios.post(`/user/setCurrentDialog`,data),

};
