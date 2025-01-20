import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


function Search(props) {
  const [chemCompound, setChemCompound] = useState("");
  const [firstCompound, setFirstCompound] = useState("");
  const [secondCompound, setSecondCompound] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect( () => {
    if(props.whichComponent === "single") {
      //console.log("params: " + props.whichComponent);
    } else if (props.whichComponent === "first" || props.whichComponent === "second") {
      setFirstCompound(params.firstCompound || "");
      setSecondCompound(params.secondCompound || "");
      //console.log("params: " + props.whichComponent + ", firstC : " + firstCompound + ", secondC: " + secondCompound);
  
    } else {
      console.log("No valid props given: " + props.whichComponent);
    }
  }, [props.whichComponent, params])
  

  async function handleSearch(event) {
    console.log("Starting search with props: " + props.whichComponent);
    if (!chemCompound) {
      console.log("In handleSearch, chem compound is empty.");
      return;
    }

    if (props.whichComponent === "single") {
      navigate(`/molecule/${chemCompound}`); // Navigate using the entered compound
    } else if (props.whichComponent === "first") {
      navigate(`/compare/${chemCompound}/${secondCompound}`);
    } else if (props.whichComponent === "second") {
      navigate(`/compare/${firstCompound}/${chemCompound}`);
    } else {
      console.log("No valid props given: " + props.whichComponent);
    }
  
  }

  function handleCompoundChange(event) {
    setChemCompound(event.target.value);
    //console.log("handleCompoundChange " + event.target.value);
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