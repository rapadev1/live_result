import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LiveScoreTable from "./components/LiveScore/LiveScoreTable.tsx";

import UpdateCompetitor from "./components/LiveScore/UpdateCompetitor.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LiveScoreTable />} />
        <Route path="/update-competitor/:id" element={<UpdateCompetitor />} />
      </Routes>
    </Router>
  );
}

export default App;
