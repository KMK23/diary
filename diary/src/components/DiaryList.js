import React, { useEffect, useState } from "react";
import Button from "./Button";
import "./DiaryList.css";
import DiaryItem from "./DiaryItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserAuth } from "../api/firebase";

const sortOptionList = [
  { name: "최신순", value: "latest" },
  { name: "오래된 순", value: "oldest" },
];
const filterOptionList = [
  { name: "전부다", value: "all" },
  { name: "좋은 감정만", value: "good" },
  { name: "안좋은 감정만", value: "bad" },
];

function ControlMenu({ optionList, value, onChange }) {
  return (
    <select
      className="ControlMenu"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {optionList.map((option, idx) => {
        return (
          <option key={idx} value={option.value}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
}

function DiaryList({ diaryList }) {
  const navigate = useNavigate();
  const [order, setOrder] = useState("latest");
  const [filter, setFilter] = useState("all");
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const auth = getUserAuth();

  const checkLogin = () => {
    if (!isAuthenticated) {
      alert("로그인을 해주세요");
      navigate("/login");
    } else {
      navigate("/new");
    }
  };

  const getSortedDiaryList = () => {
    // 필터링 함수
    const getFilteredList = (diary) => {
      // filter state 가 good이면(emotion의 값이 3보다 작거나 같을때)
      // filter state 가 good 이 아니면(emotion 값이 3보다 클때)
      if (filter === "good") {
        return diary.emotion <= 3;
      } else {
        return diary.emotion > 3;
      }
    };
    // 정렬 함수
    // const compare
    // 원래 보통 정렬 함수를 만들때(sort 함수 쓸때) compare라고 이름 씀

    const getOrderedList = (a, b) => {
      if (order === "latest") {
        return b.date - a.date;
      } else {
        return a.date - b.date;
      }
    };

    // const filterdList = diaryList.filter((diary) => getFilteredList(diary));
    const filterdList =
      filter === "all"
        ? diaryList
        : diaryList.filter((diary) => getFilteredList(diary));

    const sortedList = filterdList.sort(getOrderedList);
    //sort 함수는 파라미터를 함수로 받는다.
    return sortedList;
  };

  return (
    <div className="diaryList">
      <div className="menu_wrapper">
        <div className="control_menus">
          <ControlMenu
            optionList={sortOptionList}
            value={order}
            onChange={setOrder}
          />
          <ControlMenu
            optionList={filterOptionList}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="new_btn">
          <Button text={"새 일기쓰기"} type="positive" onClick={checkLogin} />
        </div>
        {/* {auth.currentUser && ( */}
        {isAuthenticated && (
          <div>
            <Button
              text={"로그아웃"}
              type={"negative"}
              onClick={() => {
                auth.signOut();
              }}
            />
          </div>
        )}
      </div>
      {/* 이제 정렬된거, 필터링된것 만 렌더링 해야하니까 원래 있던 diaryList 가 아닌 getSortedDiaryList 함수 안에 리턴된 값인 sortedList 가 필요해서 */}
      {getSortedDiaryList().map((diary) => (
        <DiaryItem
          {...diary}
          key={diary.id}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}

export default DiaryList;
