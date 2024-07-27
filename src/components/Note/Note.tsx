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

  const [enterPressed, setEnterPressed] = useState<boolean>(false);
  const [stateCursorPosition, setStateCursorPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refTitleEl = useRef<HTMLDivElement>(null);
  const refContentEl = useRef<HTMLDivElement>(null);

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

  const getCursorPosition = (element: HTMLDivElement): number => {
    let position = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
    return position;
  };

  const setCursorPosition = (
    element: HTMLDivElement,
    position: number
  ): void => {
    if (!element.firstChild) {
      element.appendChild(document.createTextNode(""));
    }
    const range = document.createRange();
    const selection = window.getSelection();
    let currentNode: ChildNode | null = element.firstChild;
    let currentPosition = 0;
    while (currentNode) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const textNode = currentNode as Text;
        const nodeLength = textNode.length;
        if (currentPosition + nodeLength >= position) {
          range.setStart(
            textNode,
            Math.min(position - currentPosition, nodeLength)
          );
          range.collapse(true);
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
          element.focus();
          const rect = range.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          if (rect.top < elementRect.top || rect.bottom > elementRect.bottom) {
            element.scrollTop = rect.top - elementRect.top;
          }
          return;
        }
        currentPosition += nodeLength;
      }
      currentNode = currentNode.nextSibling;
    }
    range.selectNodeContents(element);
    range.collapse(false);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    element.focus();
  };

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

        Promise.all([
          setToDB(`notes/${id}/${pathDB}`, text),
          setToDB(`notes/${id}/time`, getCurrentTime()),
        ]).finally(() => {
          setIsLoading(false);
        });

        dispatch(setTime({ id, value: getCurrentTime() }));
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

  const handleContentKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    e
  ) => {
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
        onKeyDown={handleContentKeyDown}
        onInput={handleChange(
          (p: string) => dispatch(setContent({ id, value: p })),
          "content"
        )}
      />
    </div>
  );
};

export default Note;
