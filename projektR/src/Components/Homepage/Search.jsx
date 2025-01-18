import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const [chemCompound, setChemCompound] = useState("");
  const navigate = useNavigate();
  const properties = "IUPACName,CanonicalSMILES,MolecularFormula,MolecularWeight"
  async function handleSearch() {
    if (!chemCompound) return;

    const apiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemCompound}/property/${properties}/JSON`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Error fetching data from PubChem API");
      }
      const data = await response.json();
      localStorage.setItem("moleculeData", JSON.stringify(data)); // Spremite podatke u localStorage
      console.log("Ovo je molecule data u search ", JSON.stringify(data));
      navigate("/molecule");
    } catch (error) {
      console.error("Error fetching molecule data:", error);
      setMoleculeData(null);
    }
  }

  function handleCompoundChange(event) {
    setChemCompound(event.target.value);
  }

  return (
    <>
      <div className="search-container">
        <input
          id="search-input"
          value={chemCompound}
          onChange={handleCompoundChange}
          placeholder="Enter chemical compound name"
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>
    </>
  );
}

export default Search;