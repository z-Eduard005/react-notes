import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Note from "./components/Note/Note";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note" element={<Note />} />
        <Route
          path="*"
          element={<h1 style={{ fontSize: "404px" }}>404 Not Found</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
