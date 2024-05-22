import styles from "./NotFound.module.scss";
import BackBtn from "../shared/BackBtn/BackBtn";

const NotFound: React.FC = () => {
  return (
    <section className={styles.notFound}>
      <h1>404</h1>
      <p>Page Not Found</p>
      <BackBtn />
    </section>
  );
};

export default NotFound;
