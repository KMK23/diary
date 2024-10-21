import { addDatas, deleteDatas, getDatas, updateDatas } from "./firebase";

// action types
const FETCH_ITEMS = "FETCH_ITMES";
const ADD_ITEMS = "ADD_ITEM";
const UPDATE_ITEM = "UPDATE_ITEM";
const DELETE_ITEM = "DELETE_ITEM";
const SET_ERROR = "SET_ERROR";

// Initial state
export const initialState = {
  items: [],
  error: null,
  loading: false,
};

export function reducer(state, action) {
  //state는 우리가 dispatch 함수를 호출할떄 명시적을 건네주지 않아도
  //리듀서가 알아서 관리를 하고있다.
  //dispatch 함수를 호출 할 떄 넣어주는 객체가 action으로 들어온다
  switch (action.type) {
    case FETCH_ITEMS:
      return { ...state, items: action.payload, error: null };
    case ADD_ITEMS:
      // 현재 state 에는 구조 분해해서 items, error, loading 이 있는데 뒤에 items, error 가 또 나오니까 다시 한번 정의 한거라서 우리가 원하는 모양으로 바꿔준거야
      return { ...state, items: [...state.items, action.payload], error: null };
    //   여기써준 return 값이 새로운 state가 되는거야
    // 원래는 [...prevItems, resultData ]로 써있었지만 초기값이 위에 있고 그게 state 라는곳에 들어가있으니 그리고 객체 모양이니까 이렇게썼어
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        // 우선 기존의 items에서 id가 같은 것을 찾고 삼황연산자를 써서 action.payload(수정된놈)이거나 기존 item 이거나

        // reducer 에서 주는 state 는 항상 새로운것들로 줘야해.
        error: null,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.docId !== action.payload),
        error: null,
      };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

//actions(실제 reducer가 state를 변경하기 전에 수행해야 할 작업)

// dispath 는 set함수라고 생각하면되고 그 변경해야할 무언가 값이 있어야하는데 그걸 밑에 함수에서 작성하고있는거야

//이렇게 하면 App 에서 fetch, add, update, delete만 소환해서 쓰면 되는거야
//여러군데서 firebase를 소환해서 쓰지 않아도 되니까 편함

export const fetchItems = async (collectionName, queryOptions, dispatch) => {
  const resultData = await getDatas(collectionName, queryOptions);
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "FETCH Datas 에러!!!" });
  } else {
    dispatch({ type: FETCH_ITEMS, payload: resultData });
  }
};
export const addItem = async (collectionName, addObj, dispatch) => {
  //dispatch 할 변경된 state값을 만들어야 한다.
  const resultData = await addDatas(collectionName, addObj);
  // setState(prev=>[...prev, resultData]) 라고 했을텐데 이제 dispatch를 쓰니까 여기서 쓰는게 아니고 위에 case returun 해주는 부분에 쓰는거야

  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "ADD datas 에러!!!" });
    //에러가 있을때 type으로 위에있는거 가져왔고 payload는 reducer에 action으로 들어가니까
  } else {
    dispatch({ type: ADD_ITEMS, payload: resultData });
    //dispath 실행시 reducer 함수로 간다. ==> 위에 만든거에 action 으로 들어가(dispatch안에 객체들이)
  }
};
export const updateItem = async (
  collectionName,
  docId,
  updateObj,
  dispatch
) => {
  const resultData = await updateDatas(
    collectionName,
    docId,
    updateObj,
    dispatch
  );
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "Update Datas 에러!!!" });
  } else {
    dispatch({ type: UPDATE_ITEM, payload: resultData });
    //dispath 실행시 reducer 함수로 간다. ==> 위에 만든거에 action 으로 들어가(dispatch안에 객체들이)
  }
};
export const deleteItem = async (collectionName, docId, dispatch) => {
  const resultData = await deleteDatas(collectionName, docId);
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "Delete Datas 에러!!!" });
  } else {
    dispatch({ type: DELETE_ITEM, payload: docId });
  }
};
