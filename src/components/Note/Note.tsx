import { useEffect, useState, useRef } from "react";
import styles from "./Note.module.scss";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  updateTitle,
  updateContent,
  updateTime,
  timeNow,
} from "../../reducers/noteReducer";

type HandleChange = (
  setterFunc: (text: string) => void,
  disabledEnter?: boolean
) => (e: React.ChangeEvent<HTMLDivElement>) => void;

const Note: React.FC = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.note.title);
  const content = useAppSelector((state) => state.note.content);
  const time = useAppSelector((state) => state.note.time);

  const [enterPressed, setEnterPressed] = useState<boolean>(false);
  const [stateCursorPosition, setStateCursorPosition] = useState<number>(0);

  const refTitle = useRef<HTMLDivElement>(null);
  const refContent = useRef<HTMLDivElement>(null);

  // update time only when note is changed and closed
  const refStartTitle = useRef<string>(title);
  const refStartContent = useRef<string>(content);

  useEffect(() => {
    return () => {
      if (
        title != refStartTitle.current ||
        content != refStartContent.current
      ) {
        dispatch(updateTime(timeNow()));
      }
    };
  });

  useEffect(() => {
    refTitle.current!.textContent = title;
  }, [title]);

  useEffect(() => {
    refContent.current!.textContent = content;

    // fixed cursor position of contentEditable element
    if (enterPressed) {
      setCursorPosition(refContent.current!, stateCursorPosition + 1);
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

  const handleChange: HandleChange =
    (setterFunc, disabledEnter = false) =>
    (e) => {
      let text = e.target.textContent || "";

      if (disabledEnter) {
        text = text.replace(/\n/g, "");
        e.target.textContent = text;
      }

      setterFunc(text);
    };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.key === "Enter" && e.preventDefault();
    if (refTitle.current!.textContent!.length > 399 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleTitlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (
      e.clipboardData.getData("text").length >
      400 - refTitle.current!.textContent!.length
    ) {
      e.preventDefault();
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setEnterPressed(true);
      setStateCursorPosition(getCursorPosition(refContent.current!));
    }
  };

  return (
    <div className={styles.note}>
      <div className={styles.note__nav}>
        <Link to="/">
          <KeyboardBackspaceRoundedIcon />
        </Link>
      </div>
      <div className={styles.noteMarginBottom} />
      <div
        ref={refTitle}
        className={styles.note__title}
        data-placeholder="Title"
        contentEditable="plaintext-only"
        role="textbox"
        onKeyDown={handleTitleKeyDown}
        onInput={handleChange((p: string) => dispatch(updateTitle(p)), true)}
        onPaste={handleTitlePaste}
        spellCheck="false"
      />
      <p>
        {time} | {content.length} characters
      </p>
      <div
        ref={refContent}
        className={styles.note__content}
        data-placeholder="Start typing"
        contentEditable="plaintext-only"
        role="textbox"
        onInput={handleChange((p: string) => dispatch(updateContent(p)))}
        spellCheck="false"
        onKeyDown={handleContentKeyDown}
      />
    </div>
  );
};

export default Note;
