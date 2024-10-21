import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  where,
  getDoc,
  runTransaction,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_9MKug42W7-1O4gFcn6B1yU5icrlpOAQ",
  authDomain: "diary-fad24.firebaseapp.com",
  projectId: "diary-fad24",
  storageBucket: "diary-fad24.appspot.com",
  messagingSenderId: "815818849172",
  appId: "1:815818849172:web:166de4cd434f72a2b1ad81",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function getCollection(collectionName) {
  return collection(db, collectionName);
}

function getUserAuth() {
  return auth;
}

async function getLastNum(collectionName, field) {
  const q = query(
    collection(db, collectionName),
    orderBy(field, "desc"),
    limit(1)
  );
  const lastDoc = await getDocs(q);
  if (lastDoc.docs.length === 0) return 0;
  const lastNum = lastDoc.docs[0].data()[field];
  return lastNum;
}

async function addDatas(collectionName, addObj) {
  try {
    const resultData = await runTransaction(db, async (tr) => {
      const lastId = (await getLastNum(collectionName, "id")) + 1;
      addObj.id = lastId;
      const docRef = await addDoc(getCollection(collectionName), addObj);
      const snapshot = await getDoc(docRef);
      const docData = snapshot.exists()
        ? { ...snapshot.data(), docId: snapshot.id }
        : null;
      return docData;
    });
    return resultData;
  } catch (error) {
    console.log("Error transaction", error);
  }
}

// transaction : 데이터 베이스의 작업 단위
// ==> 사용자가 한명이면 무슨 작업을 하던 이사람의 작업이 우선적으로 실행
// ==> 여러명이면 작업을 동시에 실행시키면 그 순서를 어떻게 정할꺼냐?
// ==> 그럴때 쓰는게 transaction 이고
// ==> 만약에 3명의 사용자가 일기 등록을 동시에 눌렀다? 이러면
// ==> getLastNum 마지막거 가져와서 +1 해주는데 세명이 동시에 누르면
// ==> 그 사용자들이 누르는 (등록할때) id가 모두 동일할수도 있잖아
// ==> 순서를 차례차례 지켜야 될 상황에 필요한게 transaction

function getQuery(collectionName, queryOption) {
  const { conditions = [], orderBys = [], limits } = queryOption;
  const collect = getCollection(collectionName);
  let q = query(collect);

  //where 조건
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });

  //orderBy 조건
  orderBys.forEach((order) => {
    q = query(q, orderBy(order.field, order.direction || "asc"));
  });

  //limit 조건
  q = query(q, limit(limits));

  return q;
}

async function getDatas(collectionName, queryOptions) {
  const q = getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const resultData = docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));
  return resultData;
}

async function updateDatas(collectionName, docId, updateObj) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateObj);
    const snapshot = await getDoc(docRef);
    const resultData = { ...snapshot.data(), docId: snapshot.id };

    return resultData;
  } catch (error) {
    console.log("Error Update", error);
  }
}

async function deleteDatas(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
    // return docId 해도 됌(반환받는 데이터만 있으면 되니까)
  } catch (error) {
    console.log("Error Delete", error);
  }
}
export { addDatas, getUserAuth, getDatas, updateDatas, deleteDatas };
