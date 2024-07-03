import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { removeFromDB } from "../../firebase";
import type { NoteState } from "../../reducers/notesReducer";
import { removeNote as removeNoteAction } from "../../reducers/notesReducer";
import { useAppDispatch } from "../../store/hooks";
import styles from "./SmallNote.module.scss";

type VText = { title: string; content: string; time: string };

const SmallNote: React.FC<{ note: NoteState }> = ({ note }) => {
  const dispatch = useAppDispatch();

  const [hoveredBtnId, setHoveredBtnId] = useState<string>("");
  const [deleteChecked, setDeleteChecked] = useState<boolean>(false);
  const vText = useRef<VText>({ title: "", content: "", time: "" });

  const removeNote = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (!deleteChecked) {
      setDeleteChecked(true);
      setTimeout(() => {
        setDeleteChecked(false);
      }, 3000);
    } else {
      dispatch(removeNoteAction(id));
      removeFromDB(`notes/${id}`);
    }
  };

  const validateNoteText = (
    title: string,
    content: string,
    time: string
  ): VText => {
    return {
      title: title.substring(0, 32) || content.substring(0, 32),
      content:
        (title && content.substring(0, 150)) ||
        (!title && content.substring(32, 150)
          ? "..." + content.substring(32, 150)
          : "No text"),
      time: time.slice(0, -3),
    };
  };
  vText.current = validateNoteText(note.title, note.content, note.time);

  return (
    <Link
      to={`/note/${note.id}`}
      key={note.id}
      className={
        styles.note + " " + (hoveredBtnId === note.id ? styles.hoverBtn : "")
      }
    >
      <div className={styles.noteTop}>
        <h2>{vText.current.title}</h2>
        <button
          onClick={(e) => removeNote(e, note.id)}
          onMouseOver={() => setHoveredBtnId(note.id)}
          onMouseOut={() => setHoveredBtnId("")}
        >
          {!deleteChecked ? (
            <DeleteOutlineRoundedIcon />
          ) : (
            <DoneRoundedIcon className="text-red-600" />
          )}
        </button>
      </div>
      <p>{vText.current.content}</p>
      <p>{vText.current.time}</p>
    </Link>
  );
};

export default SmallNote;
