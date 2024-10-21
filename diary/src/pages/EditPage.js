import React, { useContext, useEffect, useState } from "react";
import DiaryEditor from "../components/DiaryEditor";
import { DiaryStateContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { changeTitle } from "../util/changeTitle";
import { useSelector } from "react-redux";

function EditPage({}) {
  const [editData, setEditData] = useState();
  const { id } = useParams();
  // console.log(id);
  const navigate = useNavigate();
  // const { diaryList } = useContext(DiaryStateContext);
  const diaryList = useSelector((state) => state.diary.items);
  // console.log(diaryList);

  useEffect(() => {
    changeTitle(`감정 일기장 -${id}번 일기 수정`);
  }, []);

  useEffect(() => {
    if (diaryList.length > 0) {
      const targetDiary = diaryList.find((diary) => diary.id == id);
      if (targetDiary) {
        setEditData(targetDiary);
      } else {
        alert("잘못된 접근입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [diaryList]);
  // console.log(editData);

  return (
    <div>{editData && <DiaryEditor originData={editData} isEdit={true} />}</div>
  );
}

export default EditPage;
