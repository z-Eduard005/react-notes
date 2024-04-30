import { useEffect, useState } from "react";
import styles from "./Note.module.scss";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { Link } from "react-router-dom";

type THandleChange = (
  setterFunc: (text: string) => void,
  disabledEnter?: boolean
) => (e: React.ChangeEvent<HTMLDivElement>) => void;

const Note: React.FC = () => {
  const [titleNote, setTitleNote] = useState<string>("");
  const [contentNote, setContentNote] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>(timeNow());
  const [isChanged, setIsChanged] = useState<boolean>(false);

  function timeNow(): string {
    const date: Date = new Date();
    return (
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
    );
  }

  // update time only when note is changed and close
  useEffect(() => {
    return () => {
      if (isChanged) {
        setUpdateTime(timeNow());
      }
    };
  }, [isChanged]);

  useEffect(() => {
    setIsChanged(true);
  }, [titleNote, contentNote]);

  const handleChange: THandleChange =
    (setterFunc, disabledEnter = false) =>
    (e) => {
      let text = e.target.textContent || "";

      if (disabledEnter) {
        text = text.replace(/\n/g, "");
        e.target.textContent = text;
      }

      // if (text.length > 99) {
      //   text = titleNote.slice(0, 99);
      //   e.target.textContent = text;
      // }

      setterFunc(text);
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.note}>
      <div className={styles.note__nav}>
        <Link to="/">
          <KeyboardBackspaceRoundedIcon />
        </Link>
      </div>
      <div
        className={styles.note__title}
        data-placeholder="Title"
        contentEditable="plaintext-only"
        role="textbox"
        onInput={handleChange(setTitleNote, true)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
      <p>
        {updateTime} | {contentNote.length} characters
      </p>
      <div
        className={styles.note__content}
        data-placeholder="Start typing"
        contentEditable="plaintext-only"
        role="textbox"
        onInput={handleChange(setContentNote)}
        spellCheck="false"
      />
    </div>
  );
};

export default Note;
