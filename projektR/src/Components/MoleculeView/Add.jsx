import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Add.css";
//plusic add moze biti kliknut samo ako se vec nalazimo na urlu /molecule/imePrvogSpoja

function Add() {
  const [searrchVisible, setSearchVisible] = useState(false);
  const [minimizeVisible, setMinimizeVisible] = useState(false);
  const [secondCompound, setSecondCompound] = useState("");
  const { title } = useParams();
  const firstCompound = title;
  const navigate = useNavigate();

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
      console.log("Second compound not given");
      return;
    } else if (!firstCompound) {
      console.log("First compound not given");
    }

    navigate(`/compare/${firstCompound}/${secondCompound}`);
  }

  function handleSecondCompoundChange(event) {
    setSecondCompound(event.target.value);
    console.log("handleCompoundChange " + event.target.value);
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
      {searrchVisible && ( // Conditionally render search input only when clicked is true
        <div className="search-container">
          <input
            id="search-input"
            value={secondCompound}
            onChange={handleSecondCompoundChange}
            placeholder="Enter another chemical compound name"
          />
          <button id="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      )}
    </div>
  );
}

export default Add;
