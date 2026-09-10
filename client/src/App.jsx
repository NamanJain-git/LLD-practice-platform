import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Evaluation from "./pages/Evaluation";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/practice/:attemptId"
          element={<Practice />}
        />
        <Route
          path="/evaluation/:attemptId"
          element={<Evaluation />}
        />
        <Route
          path="/history"
          element={<History />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;