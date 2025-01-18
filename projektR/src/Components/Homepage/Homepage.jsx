import { useState } from 'react'
import '../../index.css'

import Search from './Search.jsx';

function Homepage() {

  return (
    <>
      <div className="header">
            <div className="logo">
                VisiChem
            </div>
            <div className="banner">
                <p>About us</p>
            </div>
      </div>
      <div className="welcome">
            <h1>VisiChem</h1>
            <p>See and understand molecules like never before</p>
      </div>
      <Search/>
      <img src="./molecule.png" alt=""></img>
      <div className="footer">
            <p>Made as part of a project for Faculty of electrotechincal engineering and computing, Zagreb university</p>
            <p>Authors: Milan Vidaković, Dora Špoler, Borna Svjetličić</p>
      </div>
    </>
  )
}

export default Homepage
