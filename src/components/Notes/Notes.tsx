import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useAppSelector } from "../../store/hooks";
import SmallNote from "../SmallNote/SmallNote";
import styles from "./Notes.module.scss";

const Notes: React.FC = () => {
  const { notesArray, loading, error } = useAppSelector((state) => state.notes);
  const searchParam = useAppSelector((state) => state.search.searchInput);

  const isInclude = (text: string) => {
    return text
      .replace(/\n/g, " ")
      .toLowerCase()
      .includes(searchParam.replace(/\n/g, " ").toLowerCase());
  };

  const notesForRender = notesArray
    .filter((note) => {
      return (note.title || note.content || note.time) && searchParam
        ? // if searching
          isInclude(note.title) ||
            isInclude(note.content) ||
            isInclude(note.time)
        : true;
    })
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
        notesForRender.map((note) => <SmallNote key={note.id} note={note} />)
      )}
    </section>
  );
};

export default Notes;
