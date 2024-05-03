import styles from "./Home.module.scss";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

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
      <section className={styles.notes}></section>
      <button className={styles.createBtn} onClick={createNote}>
        <AddRoundedIcon />
      </button>
    </>
  );
};
{
  /* <div>
<h2>The </h2>
<p>
  The quick brown fox jumps over the lazy dog. The quick brown fox
  jumps over the lazy dog. The quick brown fox jumps over the lazy
  dog.
</p>
</div>
h2-32 p-150 */
}
export default Home;
