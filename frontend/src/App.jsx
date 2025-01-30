import { useState } from "react";
import "./index.css";
import Homepage from "./Components/Homepage/Homepage.jsx";
import MoleculeView from "./Components/MoleculeView/MoleculeView.jsx";
import Compare from "./Components/Compare/Compare.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/compare/:firstSearchOption/:firstCompound/:secondSearchOption/:secondCompound"
            element={<Compare />}
          />
          <Route
            path="/molecule/:searchOption/:chemCompound"
            element={<MoleculeView />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
