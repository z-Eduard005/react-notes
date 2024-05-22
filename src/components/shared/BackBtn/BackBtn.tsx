import styles from "./BackBtn.module.scss";
import { Link } from "react-router-dom";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";

const BackBtn: React.FC = () => {
  return (
    <Link to="/" className={styles.backBtn}>
      <KeyboardBackspaceRoundedIcon />
    </Link>
  );
};

export default BackBtn;
