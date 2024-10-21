import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";
import { DiaryStateContext } from "../App";
import { useSelector } from "react-redux";

function HomePage(props) {
  // const { auth } = useContext(DiaryStateContext);
  const diaryList = useSelector((state) => state.diary.items);
  // console.log(diaryList);
  const [curDate, setCurDate] = useState(new Date());
  const [sortedItem, setSortedItem] = useState([]);
  // 정렬하고 나온 아이템을 배열로 담기위해

  // console.log(curDate);
  // 이건 현재 시간이야(내 컴퓨터시간)
  // console.log(new Date(2024, 8, 1));
  // 이건 내가 만들어낸 시간

  // 5의자리까지 60초
  useEffect(() => {
    //1.curDate를 활용하여 fitstDay와 lastDay를 만들어준다.
    //new Date(2024,8,1,시,분,초)
    //2.firstDay와 lastDay를 밀리세컨즈 형태로 변환
    // console.log(curDate);
    const firstDay = new Date(
      curDate.getFullYear(),
      curDate.getMonth()
    ).getTime();
    const lastDay = new Date(
      curDate.getFullYear(),
      curDate.getMonth() + 1,
      0,
      23,
      59,
      59
    ).getTime();
    // 여기서 일자에 0을 넣어주면 그 전 달 마지막날이 된다.

    // console.log(firstDay);
    // console.log(lastDay);

    //3.diaryList 에서 date 필드가 firstDay와 lastDay 사이에 있는 원소들만 뽑아서 새로운 배열을 만든다.
    const newItem = diaryList.filter(
      (diary) => diary.date >= firstDay && diary.date <= lastDay
    );
    //4.setSortedItem 사용
    setSortedItem(newItem);
  }, [curDate, diaryList]);

  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  const increaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
  };
  const decreaseMonth = () => {
    setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
  };
  return (
    <div>
      <Header
        headText={headText}
        leftChild={<Button text={"<"} onClick={decreaseMonth} />}
        rightChild={<Button text={">"} onClick={increaseMonth} />}
      />
      <DiaryList
        diaryList={sortedItem}
        // auth={auth}
      />
    </div>
  );
}

export default HomePage;
