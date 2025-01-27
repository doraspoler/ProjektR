import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Search(props) {
  const [chemCompound, setChemCompound] = useState("");
  const [searchOption, setSearchOption] = useState("name"); // Default search option
  const [firstCompound, setFirstCompound] = useState("");
  const [secondCompound, setSecondCompound] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const firstSearchOption = params.firstSearchOption;
  const secondSearchOption = params.secondSearchOption;

  const patterns = {
    name: "^[a-zA-Z\\s]{3,}$", 
    smiles: "^([^J][0-9BCOHNSOPrIFla@+\-\[\]\(\)\\\/%=#$]{6,})$/ig", 
    inchi: "^InChI\=1S?\/[A-Za-z0-9\.]+(\+[0-9]+)?(\/[cnpqbtmsih][A-Za-z0-9\-\+\(\)\,\/\?\;\.]+)*$", 
    cid: "^[0-9]+$", 
  };

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
      navigate(
        `/compare/${searchOption}/${encodeURIComponent(
          chemCompound
        )}/${secondSearchOption}/${encodeURIComponent(secondCompound)}`
      );
    } else if (props.whichComponent === "second") {
      navigate(
        `/compare/${firstSearchOption}/${encodeURIComponent(
          firstCompound
        )}/${searchOption}/${encodeURIComponent(chemCompound)}`
      );
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
    <form onSubmit={handleSearch}>
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
          pattern={patterns[searchOption]} 
          required 
        />
        <button className="search-btn" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}

export default Search;
