import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// 如果你想要追蹤流量，可以保留 Analytics，但遊戲邏輯本身不需要
// import { getAnalytics } from "firebase/analytics"; 

// 這是你剛剛找到的專屬 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyC4GmErnjPf73nnCa6gHmekfuYjsQwwROI",
  authDomain: "yessir-ee128.firebaseapp.com",
  projectId: "yessir-ee128",
  storageBucket: "yessir-ee128.firebasestorage.app",
  messagingSenderId: "192455546887",
  appId: "1:192455546887:web:33734b97d6db962dedf2a2",
  measurementId: "G-Q6KY03BQE2"
};

// 初始化 Firebase 應用程式
export const app = initializeApp(firebaseConfig);

// 初始化 Auth (身分驗證) 與 Firestore (資料庫)，並 export 出去給其他元件使用
export const auth = getAuth(app);
export const db = getFirestore(app);

// 遊戲需要的全域常數設定
export const APP_ID = 'monopoly-local-dev'; 
export const GAME_COLLECTION = 'monopoly_online_v29';