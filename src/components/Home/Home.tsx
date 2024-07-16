import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getCurrentTime, pushToDB } from "../../firebase";
import { loadNotes, removeNotesData } from "../../reducers/notesReducer";
import { setSearchInput } from "../../reducers/searchReducer";
import { removeUserData } from "../../reducers/userReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Notes from "../Notes/Notes";
import SearchForm from "../SearchForm/SearchForm";
import styles from "./Home.module.scss";
import type { NoteState } from "../../reducers/notesReducer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.notes);
  const { userName } = useAppSelector((state) => state.user);

  const [noteCreating, setNoteCreating] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!noteCreating) {
  // notesArray
  //   .filter((note) => !note.title && !note.content)
  //   .forEach((note) => {
  //     removeFromDB(`notes/${note.id}`);
  //   });

  // dispatch(removeEmptyNotes());
  //   }
  // }, [noteCreating]);

  const handleCreateNote = () => {
    setNoteCreating(true);

    pushToDB("notes", {
      title: "",
      content: "",
      time: getCurrentTime(),
    })
      .then(() => {
        return dispatch(loadNotes());
      })
      .then((data) => {
        const localNotesArray = data.payload as NoteState[];
        navigate(`/note/${localNotesArray[localNotesArray.length - 1].id}`);
      })
      .catch((err: Error) => console.error(err))
      .finally(() => {
        setNoteCreating(false);
      });
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
