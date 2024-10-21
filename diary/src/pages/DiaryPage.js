import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import { emotionList } from "../util/emotion.js";
import "../pages/DiaryPage.css";
import { changeTitle } from "../util/changeTitle.js";
import { useSelector } from "react-redux";

function DiaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  //   경로를 활용하는법
  // ==> <Route path = "diary/:id" ele~~/>
  // :id 값이 경로상으로 들어가는거고 그걸 useParams 찍어서 보면 객체안에 값이 들어온다
  // const { diaryList } = useContext(DiaryStateContext);
  const diaryList = useSelector((state) => state.diary.items);
  const [data, setData] = useState();

  console.log(diaryList);

  useEffect(() => {
    changeTitle(`감정 일기장 - ${id}번 일기`);
  }, [diaryList]);

  useEffect(() => {
    console.log("useEffect실행");
    if (diaryList.length > 0) {
      const targetDiary = diaryList.find((diary) => diary.id == id);
      if (targetDiary) {
        setData(targetDiary);
      } else {
        alert("없는 일기 입니다.");
        navigate("/", { replace: true });
      }
    }
    // targetDiary 를 찾는 방법
    // 전체 diaryList 를 확인해서 useParams로 가져온 id 와 같은 diary data 뽑아서
    //data state에 set 해준다.
    //find, filter, findIndex
  }, [diaryList]);

  if (!data) {
    return <div className="diaryPage">로딩중입니다.</div>;
  } else {
    const emotionData = emotionList.find(
      (emotion) => emotion.emotion_id == data.emotion
    );

    return (
      <div className="diaryPage">
        <Header
          headText={`${new Date(data.date).toISOString().split("T")[0]} 기록`}
          leftChild={
            <Button text={"< 뒤로가기"} onClick={() => navigate(-1)} />
          }
          rightChild={
            <Button
              text={"수정하기"}
              onClick={() => {
                navigate(`/edit/${id}`);
              }}
            />
          }
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div
              className={`diary_img_wrapper diary_img_wrapper_${data.emotion}`}
            >
              <img src={`/assets/emotion${data.emotion}.png`} />
              <div className="emotion_description">
                {emotionData.emotion_description}
              </div>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
}

export default DiaryPage;
