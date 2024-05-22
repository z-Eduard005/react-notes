import { useEffect, useState, useRef } from "react";
import styles from "./Note.module.scss";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  updateTitle,
  updateContent,
  updateTime,
} from "../../reducers/notesReducer";
import type { NoteState } from "../../reducers/notesReducer";
import { getDataDB, setToDB } from "../../firebase";
import BackBtn from "../shared/BackBtn/BackBtn";

type HandleChange = (
  setterFunc: (text: string) => void,
  pathDB: string,
  disabledEnter?: boolean
) => (e: React.ChangeEvent<HTMLDivElement>) => void;

let timeoutId: NodeJS.Timeout;

const Note: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { title, content, time } = useAppSelector(
    (state) => state.notes.notesArray.find((note) => note.id === id)!
  );

  const [enterPressed, setEnterPressed] = useState<boolean>(false);
  const [stateCursorPosition, setStateCursorPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refTitleEl = useRef<HTMLDivElement>(null);
  const refContentEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getDataDB(`notes/${id}`)
      .then((note: NoteState) => {
        dispatch(updateTitle({ id, value: note.title }));
        dispatch(updateContent({ id, value: note.content }));
        dispatch(updateTime({ id, value: note.time }));
      })
      .catch((err: Error) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    refTitleEl.current!.textContent = title;
  }, [title]);

  useEffect(() => {
    refContentEl.current!.textContent = content;

    // fixed cursor position of contentEditable element
    if (enterPressed) {
      setCursorPosition(refContentEl.current!, stateCursorPosition + 1);
      setEnterPressed(false);
    }
  }, [content]);

  const getCursorPosition = (el: HTMLDivElement): number => {
    let cursorOffset = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(el);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorOffset = preCaretRange.toString().length;
    }
    return cursorOffset;
  };
  const setCursorPosition = (el: HTMLDivElement, pos: number): void => {
    const range = document.createRange();
    const selection = window.getSelection();
    if (el.firstChild) {
      range.setStart(el.firstChild, pos);
    }
    range.collapse(true);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    el.focus();
  };

  const getcurrentTime = (): string => {
    const date = new Date();
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
  };

  const handleChange: HandleChange =
    (setterFunc, pathDB, disabledEnter = false) =>
    (e) => {
      let text = e.target.textContent || "";

      if (disabledEnter) {
        text = text.replace(/\n/g, "");
        e.target.textContent = text;
      }

      setterFunc(text);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLoading(true);
        setToDB(`notes/${id}/${pathDB}`, text).finally(() => {
          setIsLoading(false);
        });
        setToDB(`notes/${id}/time`, getcurrentTime());

        dispatch(updateTime({ id, value: getcurrentTime() }));
      }, 2000);
    };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key === "Enter" ||
      (refTitleEl.current!.textContent!.length > 399 && e.key !== "Backspace")
    ) {
      e.preventDefault();
    }
  };

  const handleTitlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (
      e.clipboardData.getData("text").length >
      400 - refTitleEl.current!.textContent!.length
    ) {
      e.preventDefault();
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setEnterPressed(true);
      setStateCursorPosition(getCursorPosition(refContentEl.current!));
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
          (p: string) => dispatch(updateTitle({ id, value: p })),
          "title",
          true
        )}
      />
      <p>
        {time} | {content.length} characters
      </p>
      <div
        ref={refContentEl}
        className={styles.note__content}
        data-placeholder="Start typing"
        contentEditable="plaintext-only"
        role="textbox"
        spellCheck="false"
        onKeyDown={handleContentKeyDown}
        onInput={handleChange(
          (p: string) => dispatch(updateContent({ id, value: p })),
          "content"
        )}
      />
    </div>
  );
};

export default Note;
