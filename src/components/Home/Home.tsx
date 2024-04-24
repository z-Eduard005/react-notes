import styles from "./Home.module.scss";

const Home = () => {
  return (
    <>
      <section className={styles.search}></section>
      <section className={styles.notes}></section>
      <button className={styles.createBtn}></button>
    </>
  );
};

export default Home;
