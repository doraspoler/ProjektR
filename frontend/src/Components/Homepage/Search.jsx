import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Search(props) {
  const [chemCompound, setChemCompound] = useState("");
  const [searchOption, setSearchOption] = useState("name"); // Default search option
  const [firstCompound, setFirstCompound] = useState("");
  const [secondCompound, setSecondCompound] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (props.whichComponent === "single") {
      // Do nothing for single search initially
    } else if (
      props.whichComponent === "first" ||
      props.whichComponent === "second"
    ) {
      setFirstCompound(params.firstCompound || "");
      setSecondCompound(params.secondCompound || "");
    } else {
      console.log("No valid props given: " + props.whichComponent);
    }
  }, [props.whichComponent, params]);

  async function handleSearch(event) {
    if (!chemCompound) {
      console.log("In handleSearch, chem compound is empty.");
      return;
    }
    console.log("U handleSearch compound: ", chemCompound);

    if (props.whichComponent === "single") {
      navigate(`/molecule/${searchOption}/${encodeURIComponent(chemCompound)}`); // Navigate using the resolved compound title
    } else if (props.whichComponent === "first") {
      navigate(`/compare/${encodeURIComponent(chemCompound)}/${encodeURIComponent(secondCompound)}`);
    } else if (props.whichComponent === "second") {
      navigate(`/compare/${encodeURIComponent(firstCompound)}/${encodeURIComponent(chemCompound)}`);
    } else {
      console.log("No valid props given: " + props.whichComponent);
    }
  }

  function handleCompoundChange(event) {
    setChemCompound(event.target.value);
  }

  function handleSearchOptionChange(event) {
    setSearchOption(event.target.value);
  }

  return (
    <>
      <div className="search-container">
        <select
          id="search-option"
          value={searchOption}
          onChange={handleSearchOptionChange}
        >
          <option value="name">Name</option>
          <option value="smiles">SMILES</option>
          <option value="inchi">InChI</option>
          <option value="cid">CID</option>
        </select>
        <input
          id="search-input"
          value={chemCompound}
          onChange={handleCompoundChange}
          placeholder={`Enter chemical compound ${searchOption}`}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </>
  );
}

export default Search;
