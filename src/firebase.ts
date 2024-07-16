import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, push, ref, remove, set } from "firebase/database";
import { store } from "./store/store";

type AddToDB = (
  path: string,
  value: string | Record<string, string>
) => Promise<void>;

type AddUserToDB = (uid: string, username: string) => Promise<any>;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const auth = getAuth(app);

let userUID: string | null;
store.subscribe(() => (userUID = store.getState().user.userUID));

export const getFromDB = async (path: string) => {
  try {
    const snapshot = await get(ref(database, `users/${userUID}/${path}`));
    return snapshot.val();
  } catch (err) {
    console.error(`Error getting ${path}: ${err}`);
  }
};

export const addUserToDB: AddUserToDB = async (uid, username) => {
  const usersRef = ref(database, "users");
  try {
    const snapshot = await get(usersRef);
    const prev: Record<string, string> = snapshot.val() || {};

    await set(usersRef, { ...prev, [uid]: { username: username } });
  } catch (err) {
    console.error(`Error adding user: ${err}`);
  }
};

export const pushToDB: AddToDB = async (path, value) => {
  try {
    await push(ref(database, `users/${userUID}/${path}`), value);
  } catch (err) {
    console.error(`Error pushing ${value}: ${err}`);
  }
};

export const setToDB: AddToDB = async (path, value) => {
  try {
    await set(ref(database, `users/${userUID}/${path}`), value);
  } catch (err) {
    console.error(`Error setting ${value}: ${err}`);
  }
};

export const removeFromDB = async (path: string) => {
  try {
    await remove(ref(database, `users/${userUID}/${path}`));
  } catch (err) {
    console.error(`Error deleting: ${err}`);
  }
};

export const getCurrentTime = () => {
  const date = new Date();
  return (
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    })
  );
};
