import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getCurrentTime, pushToDB, removeFromDB } from "../../firebase";
import {
  loadNotes,
  removeEmptyNotes,
  removeNotesData,
  toogleNoteCreating,
} from "../../reducers/notesReducer";
import { setSearchInput } from "../../reducers/searchReducer";
import { removeUserData } from "../../reducers/userReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Notes from "../Notes/Notes";
import SearchForm from "../SearchForm/SearchForm";
import styles from "./Home.module.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, notesArray, noteCreating } = useAppSelector(
    (state) => state.notes
  );
  const { userName } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!noteCreating) {
      notesArray
        .filter((note) => !note.title && !note.content)
        .forEach((note) => {
          removeFromDB(`notes/${note.id}`);
        });

      dispatch(removeEmptyNotes());
    }
  }, [noteCreating]);

  const handleCreateNote = async () => {
    toogleNoteCreating();

    await pushToDB("notes", {
      title: "",
      content: "",
      time: getCurrentTime(),
    });

    console.log(notesArray);
    await dispatch(loadNotes());
    console.log(notesArray);

    navigate(`/note/${notesArray[notesArray.length - 1].id}`);

    toogleNoteCreating();
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUserData());
        dispatch(removeNotesData());
        dispatch(setSearchInput(""));
      })
      .catch((err: Error) => console.error(err));
  };

  return (
    <>
      <button
        className={styles.signoutBtn}
        onClick={handleSignOut}
        disabled={loading}
      >
        {userName}
        <LogoutRoundedIcon />
      </button>
      <SearchForm />
      <Notes />
      <button
        className={styles.createBtn}
        onClick={handleCreateNote}
        disabled={noteCreating}
      >
        {noteCreating ? (
          <AutorenewRoundedIcon className="loader" />
        ) : (
          <AddRoundedIcon />
        )}
      </button>
    </>
  );
};

export default Home;
