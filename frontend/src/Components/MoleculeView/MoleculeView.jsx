import "./MoleculeView.css";
import React, { useEffect, useRef, useState } from "react";
import Search from "../Homepage/Search.jsx";
import "../Homepage/Search.css";
import { useNavigate, useParams } from "react-router-dom";
import Add from "./Add.jsx";

function MoleculeView() {
  const { searchOption: firstSearchOption, chemCompound } = useParams();
  const viewerRef = useRef(null);
  const [style, setStyle] = useState("stick"); // Default stil = stick
  const [moleculeData, setMoleculeData] = useState(null); // Store molecule data
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Ovo je searchOption:  ", firstSearchOption);
    console.log("Ovo je chemCompound:  ", encodeURIComponent(chemCompound));
    const fetchMoleculeData = async () => {
      const apiUrl = `http://localhost:5000/search`;
      try {
        const requestBody = {
          type: firstSearchOption,
          query: encodeURIComponent(chemCompound),
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (response.status === "404") {
          alert(
            "Entered compound " + title + "could not be found in database."
          );
        } else if (!response.ok) {
          throw new Error("Error fetching data from PubChem API");
        }
        const data = await response.json();
        //console.log("spremam moleculeData u localStorage");
        //localStorage.setItem("moleculeData", JSON.stringify(data)); // Spremite podatke u localStorage
        setMoleculeData(data);
      } catch (error) {
        console.error("Error fetching molecule data:", error);
        setMoleculeData(null);
      }
    };

    fetchMoleculeData();
  }, [chemCompound]);

  const computed_properties = moleculeData?.computed_properties || {};
  const solubility = moleculeData?.solubility || {};
  const tox21_properties = moleculeData?.tox21_properties || {};

  console.log(tox21_properties);

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol = async () => {
      if (viewerRef.current && moleculeData?.computed_properties) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer");
        const viewer = window.$3Dmol.createViewer(viewerRef.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors});

        const cid = computed_properties.cid;

        try {
          // Fetch molecular data for the CID
          const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=2d`
          );
          console.log("response : " + response);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch CID ${cid}: ${response.statusText}`
            );
          }

          const sdfData = await response.text(); // Get SDF data as text
          viewer.addModel(sdfData, "sdf");
          viewer.setStyle({}, { [style]: {} });
          viewer.zoomTo();
          /*
          if (spinEnabled) {
            viewer.spin({ axis: "y", speed: spinSpeed });
          } else {
            viewer.spin(false);
          }
            */
          viewer.render();
          console.log(`Successfully loaded CID ${cid}`);
        } catch (error) {
          console.error(`Error loading model for CID ${cid}:`, error);
        }
      }
    };
    load3Dmol();
  }, [moleculeData, style]); //+spinEnabled, spinSpeed,

  const handleHomepageButtonClick = () => {
    navigate("/");
  };

  //treba ubacit object add na returna ali trenutno baca gresku
  return (
    <>
      <button className="homepage-button" onClick={handleHomepageButtonClick}>
        <img src="../../../molecule.png" alt=""></img>
      </button>
      <Add firstSearchOption={firstSearchOption} firstCompound={chemCompound} />
      <div className="molecule-view">
        <div className="title"><h2>{computed_properties.title}</h2></div>
        <div className="search">
          <Search whichComponent="single"></Search>
        </div>
        <div className="view-and-properties">
          <div className="viewer-container">
            <div className="viewer_3Dmoljs" ref={viewerRef}></div>
            <div className="controls">
              <label>
                Style:
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="stick">Stick</option>
                  <option value="sphere">Sphere</option>
                </select>
              </label>
            </div>
          </div>

          <div className="properties">
            <h2>Molecule Information</h2>
            <ul>
              {computed_properties.title != null && (
                <li>
                  <strong>Title:</strong>
                  <span className="property">{computed_properties.title}</span>
                </li>
              )}
              {computed_properties.cid != null && (
                <li>
                  <strong>CID:</strong>
                  <span className="property">{computed_properties.cid}</span>
                </li>
              )}
              {computed_properties.IUPACName != null && (
                <li>
                  <strong>IUPAC name:</strong>
                  <span className="property">
                    {computed_properties.IUPACName}
                  </span>
                </li>
              )}
              {computed_properties.InChi != null && (
                <li>
                  <strong>InChI:</strong>
                  <span className="property">{computed_properties.InChi}</span>
                </li>
              )}
              {computed_properties.InChiKey != null && (
                <li>
                  <strong>InChIKey:</strong>
                  <span className="property">
                    {computed_properties.InChiKey}
                  </span>
                </li>
              )}
              {computed_properties.canonicalSMILES != null && (
                <li>
                  <strong>Canonical SMILES:</strong>
                  <span className="property">
                    {computed_properties.canonicalSMILES}
                  </span>
                </li>
              )}
              {computed_properties.molecularFormula != null && (
                <li>
                  <strong>Molecular formula:</strong>
                  <span className="property">
                    {computed_properties.molecularFormula}
                  </span>
                </li>
              )}
              {computed_properties.logP != null && (
                <li>
                  <strong>logP:</strong>
                  <span className="property">{computed_properties.logP}</span>
                </li>
              )}
              {computed_properties.exactMass != null && (
                <li>
                  <strong>Exact mass:</strong>
                  <span className="property">
                    {computed_properties.exactMass + " Da"}
                  </span>
                </li>
              )}
              {computed_properties.molecularWeight != null && (
                <li>
                  <strong>Molecular weight:</strong>
                  <span className="property">
                    {computed_properties.molecularWeight + " g/mol"}
                  </span>
                </li>
              )}
              {computed_properties.polarSurfaceArea != null && (
                <li>
                  <strong>TPSA:</strong>
                  <span className="property">
                    {computed_properties.polarSurfaceArea + " Å²"}
                  </span>
                </li>
              )}
              {solubility && (
                <li>
                  <strong>Solubility:</strong>
                  <span className="property">{solubility + " log(mol/L)"}</span>
                </li>
              )}
            </ul>
            <h3>Tox21 Properties:</h3>
            <div className="tox21-properties-grid">
              {Object.entries(tox21_properties).map(([key, value], index) => (
                <>
                  <div className="tox21-property" key={index}>
                    <strong>{key}:</strong> {value.toFixed(2)}
                    <div
                      className={`checkbox ${value > 0.5 ? "checked" : ""}`}
                    ></div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoleculeView;
