import { useAppSelector } from "../../store/hooks";
import styles from "./Notes.module.scss";
import { Link } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

const Notes: React.FC = () => {
  const { notesArray, loading, error } = useAppSelector((state) => state.notes);

  return (
    <section className={styles.notes}>
      {loading ? (
        <AutorenewRoundedIcon className="loader" />
      ) : error ? (
        <h1>Error: {error}</h1>
      ) : (
        notesArray.map((note) => (
          <Link to={`/note/${note.id}`} key={note.id}>
            <h2>{note.title.substring(0, 32)}</h2>
            <p>{note.content.substring(0, 150)}</p>
            <p>{note.time}</p>
          </Link>
        ))
      )}
    </section>
  );
};

export default Notes;
