const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const UserInitialState = {
  user: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case LOGIN:
      return;

    case LOGOUT:
      return;

    default:
      return state;
  }
}

export { UserInitialState, userReducer };
