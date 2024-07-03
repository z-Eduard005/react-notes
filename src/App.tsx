import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import Note from "./components/Note/Note";
import ScrollMemory from "./components/ScrollMemory/ScrollMemory";
import UserListener from "./components/UserListener/UserListener";
import { addUserToDB, getFromDB } from "./firebase";
import { loadNotes } from "./reducers/notesReducer";
import { setUserName, toogleIsSigningUp } from "./reducers/userReducer";
import { useAppDispatch, useAppSelector } from "./store/hooks";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notesArray, loading } = useAppSelector((state) => state.notes);
  const { userUID, isSigningUp, userName, authChecked } = useAppSelector(
    (state) => state.user
  );
  const ids = useMemo(() => notesArray.map((note) => note.id), [notesArray]);

  useEffect(() => {
    if (userUID) {
      if (!isSigningUp) {
        dispatch(loadNotes());

        getFromDB("username").then((username: string) => {
          dispatch(setUserName(username));
        });
      } else {
        addUserToDB(userUID, userName);
        dispatch(toogleIsSigningUp());
      }
    }
  }, [userUID]);

  return (
    <BrowserRouter>
      <UserListener />
      <ScrollMemory />
      <Routes>
        <Route
          path="/"
          element={
            loading || !authChecked ? (
              <AutorenewRoundedIcon className="loader" />
            ) : !userUID ? (
              <Auth />
            ) : (
              <Home />
            )
          }
        />
        {ids.length === 0 && userUID ? (
          // while note loading
          <Route
            path="/note/*"
            element={<AutorenewRoundedIcon className="loader" />}
          />
        ) : (
          ids.map((id) => (
            <Route key={id} path={`/note/${id}`} element={<Note id={id} />} />
          ))
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
