import '../../index.css'
import PropTypes from 'prop-types';

import Search from './Search.jsx';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';

function Homepage() {

  return (
    <>
      <Header/>
      <div className="welcome">
            <h1>VisiChem</h1>
            <p>See and understand molecules like never before</p>
      </div>
      <Search whichComponent="single"/>
      <img src="./molecule.png" alt=""></img>
      <Footer/>
    </>
  )
}

export default Homepage
