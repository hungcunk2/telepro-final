import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDxzMSn3dLpHfZRhXXWPlYTDiSARmGz4ME",
  authDomain: "chat-zalo-de628.firebaseapp.com",
  projectId: "chat-zalo-de628",
  storageBucket: "chat-zalo-de628.appspot.com",
  messagingSenderId: "72965652977",
  appId: "1:72965652977:web:4411a86321395c217e4450",
  measurementId: "G-9HBM85W7NZ"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

enableIndexedDbPersistence(db, { forceOwnership: false });
