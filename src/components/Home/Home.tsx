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
      <section className={styles.notes}>
        <div>
          <h2>The </h2>
          <p>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog.
          </p>
        </div>
        <div>
          <h2>The quick brown fox jumps over</h2>
          <p>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog
          </p>
        </div>
        <div>
          <h2>The quick </h2>
          <p>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
        </div>
        <div>
          <h2>The quick brown fox jumps over</h2>
          <p>Tjumps over the lazy dog.</p>
        </div>
        <div>
          <h2>The quick brown fox jumps over</h2>
          <p>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
        </div>
        <div>
          {/* 32 */}
          <h2>The quick brown fox jumps over</h2>
          {/* 150 */}
          <p>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
        </div>
        <div>
          <h2>The quick brown fox jumps over</h2>
          <p>The quick</p>
        </div>
      </section>
      <button className={styles.createBtn} onClick={createNote}>
        <AddRoundedIcon />
      </button>
    </>
  );
};

export default Home;
