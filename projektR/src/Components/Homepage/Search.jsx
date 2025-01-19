import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


function Search(props) {
  const [chemCompound, setChemCompound] = useState("");
  const navigate = useNavigate();
  const params = useParams(); // Get all params dynamically

  async function handleSearch() {
    console.log("Starting search with props: " + props.whichComponent);
    if (!chemCompound) {
      console.log("In handleSearch, chem compound is empty.");
      return;
    }

    if (props.whichComponent === "single") {
      navigate(`/molecule/${chemCompound}`); // Navigate using the entered compound
    } else if (props.whichComponent === "first") {
      const { secondCompound } = params; // Extract the second compound from params
      navigate(`/compare/${chemCompound}/${secondCompound}`);
    } else if (props.whichComponent === "second") {
      const { firstCompound } = params; // Extract the first compound from params
      navigate(`/compare/${firstCompound}/${chemCompound}`);
    } else {
      console.log("No valid props given: " + props.whichComponent);
    }
  
  }

  function handleCompoundChange(event) {
    setChemCompound(event.target.value);
    console.log("handleCompoundChange " + event.target.value);
  }

  return (
    <>
      <div className="search-container">
        <input
          id="search-input"
          value={chemCompound}
          onChange={handleCompoundChange}
          placeholder={"Enter chemical compound name"}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>
    </>
  );
}

export default Search;