import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentTime, pushToDB } from "../../firebase";
import { loadNotes } from "../../reducers/notesReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { store } from "../../store/store";
import Notes from "../Notes/Notes";
import styles from "./Home.module.scss";
import { setSerchInput } from "../../reducers/searchInputReducer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { serchInput } = useAppSelector((state) => state.serchInput);

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const createNote = async () => {
    setIsCreating(true);
    await pushToDB("notes", {
      title: "",
      content: "",
      time: getCurrentTime(),
    });
    await dispatch(loadNotes());

    const notes = store.getState().notes.notesArray;

    navigate(`/note/${notes[notes.length - 1].id}`);
    setIsCreating(false);
  };

  return (
    <>
      <section className={styles.search}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <SearchRoundedIcon />
          <input
            type="search"
            placeholder="Search"
            value={serchInput}
            onChange={(e) => {
              dispatch(setSerchInput(e.target.value));
            }}
          />
          {serchInput && (
            <button type="reset" onClick={() => dispatch(setSerchInput(""))}>
              <CloseRoundedIcon />
            </button>
          )}
        </form>
      </section>
      <div className={styles.searchMarginBottom} />
      <Notes />
      <button
        className={styles.createBtn}
        onClick={createNote}
        disabled={isCreating}
      >
        {isCreating ? (
          <AutorenewRoundedIcon className="loader" />
        ) : (
          <AddRoundedIcon />
        )}
      </button>
    </>
  );
};

export default Home;
