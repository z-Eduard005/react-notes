import styles from "./Home.module.scss";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Notes from "../Notes/Notes";

const Home: React.FC = () => {
  const createNote = () => {};

  return (
    <>
      <section className={styles.search}>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
          }}
        >
          <SearchRoundedIcon />
          <input type="search" placeholder="Search" />
        </form>
      </section>
      <div className={styles.searchMarginBottom} />
      <Notes />
      <button className={styles.createBtn} onClick={createNote}>
        <AddRoundedIcon />
      </button>
    </>
  );
};

export default Home;
