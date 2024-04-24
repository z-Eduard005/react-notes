import { useState } from "react";
import styles from "./Note.module.scss";

type THandleChange = (
  setterFunc: (text: string) => void,
  disabledEnter?: boolean
) => (e: React.ChangeEvent<HTMLDivElement>) => void;

const Note: React.FC = () => {
  const [titleNote, setTitleNote] = useState<string>("");
  const [contentNote, setContentNote] = useState<string>("");

  const handleChange: THandleChange =
    (setterFunc, disabledEnter = false) =>
    (e) => {
      let text = e.target.textContent || "";

      if (disabledEnter) {
        e.target.textContent = text.replace(/\n/g, "");
      }

      setterFunc(text);
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.note}>
      <div
        className={styles.note__title}
        data-placeholder="Title"
        contentEditable="plaintext-only"
        role="textbox"
        onInput={handleChange(setTitleNote, true)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
      <p>April 22 16:17 | {contentNote.length} characters</p>
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
