import "../../index.css";
import Search from "./Search.jsx";
import Footer from "../Footer.jsx";

function Homepage() {
  return (
    <>
      <div className="welcome">
        <h1>VisiChem</h1>
        <p>See and understand molecules like never before</p>
      </div>
      <Search whichComponent="single" />
      <img src="./molecule.png" alt=""></img>
      <Footer />
    </>
  );
}

export default Homepage;
