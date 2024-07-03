import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { Link } from "react-router-dom";
import styles from "./BackBtn.module.scss";

const BackBtn: React.FC = () => {
  return (
    <Link to="/" className={styles.backBtn}>
      <KeyboardBackspaceRoundedIcon />
    </Link>
  );
};

export default BackBtn;
