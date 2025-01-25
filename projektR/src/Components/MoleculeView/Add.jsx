import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Add.css";

function Add({ firstSearchOption, firstCompound }) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [minimizeVisible, setMinimizeVisible] = useState(false);
  const [secondCompound, setSecondCompound] = useState("");
  const [secondSearchOption, setSecondSearchOption] = useState("name"); // Default search option for second compound

  // Parametri iz trenutnog URL-a za prvi spoj
  const navigate = useNavigate();
  console.log("first compound u add.jsx: ", firstCompound);
  console.log("first search option: ", firstSearchOption);

  const handleAdd = () => {
    setMinimizeVisible(true);
    setSearchVisible(true);
  };

  const handleMinimize = () => {
    setSearchVisible(false);
    setMinimizeVisible(false);
  };

  async function handleSearch(event) {
    if (!secondCompound) {
      console.log("Second compound not provided");
      return;
    }

    if (!firstCompound || !firstSearchOption) {
      console.log("First compound or search option not provided");
      return;
    }

    // Navigacija prema URL-u s atributima oba spoja
    navigate(
      `/compare/${firstSearchOption}/${firstCompound}/${secondSearchOption}/${secondCompound}`
    );
  }

  function handleSecondCompoundChange(event) {
    setSecondCompound(event.target.value);
  }

  function handleSecondSearchOptionChange(event) {
    setSecondSearchOption(event.target.value);
  }

  return (
    <div>
      <button className="add-button" onClick={handleAdd}>
        +
      </button>
      {minimizeVisible && (
        <button className="minimize-button" onClick={handleMinimize}>
          -
        </button>
      )}
      {searchVisible && (
        <div className="search-container">
          <div>
            <select
              id="search-option"
              value={secondSearchOption}
              onChange={handleSecondSearchOptionChange}
            >
              <option value="name">Name</option>
              <option value="smiles">SMILES</option>
              <option value="inchi">InChI</option>
              <option value="cid">CID</option>
            </select>
          </div>

          {/* Input za unos drugog spoja */}
          <input
            id="search-input"
            value={secondCompound}
            onChange={handleSecondCompoundChange}
            placeholder={`Enter chemical compound ${secondSearchOption}`}
          />
          {/* Gumb za pretraživanje */}
          <button id="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      )}
    </div>
  );
}

export default Add;
