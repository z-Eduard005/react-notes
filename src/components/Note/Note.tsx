import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useEffect, useRef, useState } from "react";
import { getCurrentTime, setToDB } from "../../firebase";
import { setContent, setTime, setTitle } from "../../reducers/notesReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import BackBtn from "../shared/BackBtn/BackBtn";
import styles from "./Note.module.scss";

const MAX_TITLE_LENGTH = 400;
const DEBOUNCE_DELAY = 500;

let timeoutId: NodeJS.Timeout;

type HandleChange = (
  e: React.FormEvent<HTMLDivElement>,
  pathDB: "title" | "content"
) => void;

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

  const handleChange: HandleChange = (e, pathDB) => {
    const text = (e.target as HTMLDivElement).textContent || "";
    const setterFn = pathDB === "title" ? setTitle : setContent;

    dispatch(setterFn({ id, value: text }));

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (notesArray.some((note) => note.id === id)) {
        setIsLoading(true);

        const currentTime = getCurrentTime();
        Promise.all([
          setToDB(`notes/${id}/${pathDB}`, text),
          setToDB(`notes/${id}/time`, currentTime),
        ])
          .catch((err: Error) => console.error(err))
          .finally(() => {
            setIsLoading(false);
          });

        dispatch(setTime({ id, value: currentTime }));
      }
    }, DEBOUNCE_DELAY);
  };

  const handleTitleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (
      e.key === "Enter" ||
      (refTitleEl.current!.textContent!.length > MAX_TITLE_LENGTH - 1 &&
        e.key !== "Backspace")
    ) {
      e.preventDefault();
    }
  };

  const handleTitlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    const cbData = e.clipboardData.getData("text");
    if (
      cbData.length >
        MAX_TITLE_LENGTH - refTitleEl.current!.textContent!.length ||
      cbData.includes("\n")
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.note}>
      <nav>
        <BackBtn />
        {isLoading && <AutorenewRoundedIcon />}
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
        onInput={(e) => handleChange(e, "title")}
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
        onInput={(e) => handleChange(e, "content")}
      />
    </div>
  );
};

export default Note;
