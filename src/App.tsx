import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Note from "./components/Note/Note";
import { useAppSelector } from "./store/hooks";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import NotFound from "./components/NotFound/NotFound";

const App: React.FC = () => {
  const ids = useAppSelector((state) =>
    state.notes.notesArray.map((note) => note.id)
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {ids.length === 0 ? (
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
