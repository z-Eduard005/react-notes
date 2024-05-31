import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { removeFromDB } from "../../firebase";
import {
  removeEmptyNotes,
  removeNote as removeNoteAction,
} from "../../reducers/notesReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import styles from "./Notes.module.scss";

type VText = { title: string; content: string };

const Notes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notesArray, loading, error } = useAppSelector((state) => state.notes);
  const searchParam = useAppSelector((state) => state.serchInput.serchInput);

  const [hoveredBtnId, setHoveredBtnId] = useState<string>("");
  const [deleteChecked, setDeleteChecked] = useState<Record<string, boolean>>(
    {}
  );
  const vText = useRef<VText>({ title: "", content: "" });

  useEffect(() => {
    notesArray
      .filter((note) => !note.title && !note.content)
      .forEach((note) => {
        removeFromDB(`notes/${note.id}`);
      });

    dispatch(removeEmptyNotes());
  }, []);

  const removeNote = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (!deleteChecked[id]) {
      setDeleteChecked((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setDeleteChecked((prev) => ({ ...prev, [id]: false }));
      }, 3000);
    } else {
      dispatch(removeNoteAction(id));
      removeFromDB(`notes/${id}`);
    }
  };

  const validateNoteText = (title: string, content: string): VText => {
    return {
      title: title.substring(0, 32) || content.substring(0, 32),
      content:
        (title && content.substring(0, 150)) ||
        (!title && content.substring(32, 150)
          ? "..." + content.substring(32, 150)
          : "No text"),
    };
  };

  const prepareForSearch = (text: string) => {
    return text.replace(/\n/g, " ").toLowerCase();
  };

  const notesForRender = notesArray
    .filter((note) => {
      return (note.title || note.content) && searchParam
        ? // if searching
          prepareForSearch(note.title).includes(
            prepareForSearch(searchParam)
          ) ||
            prepareForSearch(note.content).includes(
              prepareForSearch(searchParam)
            )
        : true;
    })
    .slice()
    .sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  return (
    <section className={styles.notes}>
      {loading ? (
        <AutorenewRoundedIcon className="loader" />
      ) : error ? (
        <h1 className={styles.error}>Error: {error}</h1>
      ) : notesForRender.length === 0 && searchParam ? (
        <h1 className={styles.noYet}>Nothing found for that query</h1>
      ) : notesForRender.length === 0 ? (
        <h1 className={styles.noYet}>There are no notes yet</h1>
      ) : (
        notesForRender.map(
          (note) => (
            (vText.current = validateNoteText(note.title, note.content)),
            (
              <Link
                to={`/note/${note.id}`}
                key={note.id}
                className={hoveredBtnId === note.id ? styles.hoverBtn : ""}
              >
                <div className={styles.noteTop}>
                  <h2>{vText.current.title}</h2>
                  <button
                    onClick={(e) => removeNote(e, note.id)}
                    onMouseOver={() => setHoveredBtnId(note.id)}
                    onMouseOut={() => setHoveredBtnId("")}
                  >
                    {!deleteChecked[`${note.id}`] ? (
                      <DeleteOutlineRoundedIcon />
                    ) : (
                      <DoneRoundedIcon className="text-red-700" />
                    )}
                  </button>
                </div>
                <p>{vText.current.content}</p>
                <p>{note.time.slice(0, -3)}</p>
              </Link>
            )
          )
        )
      )}
    </section>
  );
};

export default Notes;
