import { createSlice } from "@reduxjs/toolkit";
import { getUserAuth } from "../api/firebase";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, //유저 정보 => auth.current 객체에서 가져오기
    isAuthenticated: false, //로그인 상태
    error: null, //에러 메세지
  },
  reducers: {
    loginSuccess(state, action) {
      //   Object.keys(state).forEach((key, i) => {
      //     state[key] = action;
      //   });
      //   state.user = action.payload;
      //   state.isAuthenticated = true;
      //   state.error = null;
      setUserState(state, action);
    },
    loginFailure(state, action) {
      //   state.user = null;
      //   state.isAuthenticated = false;
      //   state.error = action.payload;
      setUserState(state, action);
    },
    logOut(state, action) {
      //   state.user = null;
      //   state.isAuthenticated = false;
      //   state.error = null;
      setUserState(state, action);
    },
  },
});

function setUserState(state, action) {
  Object.keys(state).forEach((key, idx) => {
    state[key] = action.payload[idx];
  });
}

export default userSlice;
export const { loginSuccess, loginFailure, logOut } = userSlice.actions;
