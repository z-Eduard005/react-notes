import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set, push } from "firebase/database";
import type { NoteState } from "./reducers/notesReducer";

type ObjectParam = {
  [key: string]: string | number | boolean;
};

type AddToDB = (
  path: string,
  value: string | number | boolean | ObjectParam
) => Promise<void>;

const firebaseConfig = {
  databaseURL: "https://db-todo-40986-default-rtdb.firebaseio.com/",
  // !!!!!!!!!!!! add env_var
  projectId: "118355543822",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const getDataDB = (path: string): Promise<any> => {
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

// set with id
export const setToDB: AddToDB = async (path, value) => {
  try {
    await set(ref(database, "users/user1/" + path), value);
  } catch (err) {
    console.error(`Error updating ${value}: ${err}`);
  }
};

// never used!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const pushToDB: AddToDB = async (path, value) => {
  try {
    await push(ref(database, "users/user1/" + path), value);
  } catch (err) {
    console.error(`Error updating ${value}: ${err}`);
  }
};
