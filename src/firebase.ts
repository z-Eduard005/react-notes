import { initializeApp } from "firebase/app";
import {
  getDatabase,
  onValue,
  ref,
  set,
  push,
  remove,
} from "firebase/database";
import type { NoteState } from "./reducers/notesReducer";

type AddToDB = (
  path: string,
  value: string | Record<string, string>
) => Promise<void>;

const firebaseConfig = {
  databaseURL: "https://db-todo-40986-default-rtdb.firebaseio.com/",
  projectId: "118355543822",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const getFromDB = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    onValue(
      ref(database, "users/user1/" + path),
      (snapshot) => {
        const data: NoteState = snapshot.val();
        resolve(data);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const setToDB: AddToDB = async (path, value) => {
  try {
    await set(ref(database, "users/user1/" + path), value);
  } catch (err) {
    console.error(`Error updating ${value}: ${err}`);
  }
};

// push with id
export const pushToDB: AddToDB = async (path, value) => {
  try {
    await push(ref(database, "users/user1/" + path), value);
  } catch (err) {
    console.error(`Error updating ${value}: ${err}`);
  }
};

export const removeFromDB = async (path: string) => {
  try {
    await remove(ref(database, "users/user1/" + path));
  } catch (err) {
    console.error(`Error deleting: ${err}`);
  }
};

export const getCurrentTime = (): string => {
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
