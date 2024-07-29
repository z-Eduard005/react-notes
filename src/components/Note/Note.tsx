import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useEffect, useRef, useState } from "react";
import { getCurrentTime, setToDB } from "../../firebase";
import { setContent, setTime, setTitle } from "../../reducers/notesReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import BackBtn from "../shared/BackBtn/BackBtn";
import styles from "./Note.module.scss";

type HandleChange = (
  setterFunc: (text: string) => void,
  pathDB: string
) => (e: React.ChangeEvent<HTMLDivElement>) => void;

let timeoutId: NodeJS.Timeout;

const Note: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { notesArray } = useAppSelector((state) => state.notes);
  const { title, content, time } = useAppSelector(
    (state) => state.notes.notesArray.find((note) => note.id === id)!
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refTitleEl = useRef<HTMLDivElement>(null);
  const refContentEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refContentEl.current!.textContent = content;
    refTitleEl.current!.textContent = title;
  }, []);

  const handleChange: HandleChange = (setterFunc, pathDB) => (e) => {
    let text = e.target.textContent || "";

    // disable enter
    if (pathDB === "title") {
      text = text.replace(/\n/g, "");
      e.target.textContent = text;
    }

    setterFunc(text);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (notesArray.some((note) => note.id === id)) {
        setIsLoading(true);

        const currentTime = getCurrentTime();
        Promise.all([
          setToDB(`notes/${id}/${pathDB}`, text),
          setToDB(`notes/${id}/time`, currentTime),
        ]).finally(() => {
          setIsLoading(false);
        });

        dispatch(setTime({ id, value: currentTime }));
      }
    }, 500);
  };

  const handleTitleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (
      e.key === "Enter" ||
      (refTitleEl.current!.textContent!.length > 399 && e.key !== "Backspace")
    ) {
      e.preventDefault();
    }
  };

  const handleTitlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    if (
      e.clipboardData.getData("text").length >
      400 - refTitleEl.current!.textContent!.length
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.note}>
      <nav>
        <BackBtn />
        <AutorenewRoundedIcon
          style={{ display: isLoading ? "block" : "none" }}
        />
      </nav>
      <div className={styles.noteMarginBottom} />
      <div
        ref={refTitleEl}
        className={styles.note__title}
        data-placeholder="Title"
        contentEditable="plaintext-only"
        role="textbox"
        spellCheck="false"
        onKeyDown={handleTitleKeyDown}
        onPaste={handleTitlePaste}
        onInput={handleChange(
          (p: string) => dispatch(setTitle({ id, value: p })),
          "title"
        )}
      />
      <p>
        {time.slice(0, -3)} | {content.length} characters
      </p>
      <div
        ref={refContentEl}
        className={styles.note__content}
        data-placeholder="Start typing"
        contentEditable="plaintext-only"
        role="textbox"
        spellCheck="false"
        onInput={handleChange(
          (p: string) => dispatch(setContent({ id, value: p })),
          "content"
        )}
      />
    </div>
  );
};

export default Note;
