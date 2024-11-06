import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

import Header from "./Header.jsx";
import Search from './Search.jsx';
import Welcome from './Welcome.jsx';
import Footer from './Footer.jsx';

function App() {

  return (
    <>
      <Header/>
      <Welcome/>
      <Search/>
      <img src="../public/molecule.png" alt=""></img>
      <Footer/>
    </>
  )
}

export default App
