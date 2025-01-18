import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Homepage from './Components/Homepage/Homepage.jsx'
import MoleculeView from './Components/MoleculeView/MoleculeView.jsx'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div>
        <Router>
          <Routes>
            <Route path = "/" element={<Homepage/>} />
            <Route path = "/molecule" element={<MoleculeView/>} />
          </Routes>
        </Router>
      </div>
  )
}

export default App
