import React, { useEffect, useRef, useState } from "react";
import Search from "../Homepage/Search.jsx";
import "../Homepage/Search.css";
import { useNavigate, useParams } from "react-router-dom";
import "../MoleculeView/MoleculeView.css";
import "./Compare.css";

function Compare() {
  const params = useParams();
  const navigate = useNavigate();
  const firstCompound = params.firstCompound;
  const secondCompound = params.secondCompound;
  const firstSearchOption = params.firstSearchOption;
  const secondSearchOption = params.secondSearchOption;
  console.log(
    "First compound: " + firstCompound + ", second compound: " + secondCompound
  );

  const handleRemove = (compoundToRemove) => {
    const remainingCompound =
      compoundToRemove === firstCompound ? secondCompound : firstCompound;

    const searchOption =
      compoundToRemove === firstCompound
        ? secondSearchOption
        : firstSearchOption;

    navigate(
      `/molecule/${searchOption}/${encodeURIComponent(remainingCompound)}`
    );
  };

  const viewerRef1 = useRef(null);
  const [style1, setStyle1] = useState("stick"); // Default stil = stick

  const viewerRef2 = useRef(null);
  const [style2, setStyle2] = useState("stick"); // Default stil = stick

  const [firstMoleculeData, setFirstMoleculeData] = useState(null); // Store molecule data
  const [secondMoleculeData, setSecondMoleculeData] = useState(null); // Store molecule data
  const handleHomepageButtonClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchFirstMoleculeData = async () => {
      //dohvaćanje prve molekule
      const apiUrl = `http://localhost:5000/search`;
      try {
        const requestBody = {
          type: firstSearchOption,
          query: encodeURIComponent(firstCompound),
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error("Error fetching data from PubChem API");
        }
        const data1 = await response.json();
        //console.log("spremam moleculeData u localStorage");
        //localStorage.setItem("moleculeData", JSON.stringify(data)); // Spremite podatke u localStorage
        setFirstMoleculeData(data1);
      } catch (error) {
        console.error("Error fetching molecule data:", error);
        setFirstMoleculeData(null);
      }
    };

    fetchFirstMoleculeData();
  }, [firstCompound]);

  useEffect(() => {
    const fetchSecondMoleculeData = async () => {
      //dohvaćanje druge molekule
      const apiUrl = `http://localhost:5000/search`;
      try {
        const requestBody = {
          type: secondSearchOption,
          query: encodeURIComponent(secondCompound),
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error("Error fetching data from PubChem API");
        }
        const data2 = await response.json();
        //console.log("spremam moleculeData u localStorage");
        //localStorage.setItem("moleculeData", JSON.stringify(data)); // Spremite podatke u localStorage
        setSecondMoleculeData(data2);
      } catch (error) {
        console.error("Error fetching molecule data:", error);
        setSecondMoleculeData(null);
      }
    };

    fetchSecondMoleculeData();
  }, [secondCompound]);

  const computed_properties1 = firstMoleculeData?.computed_properties || {};
  const computed_properties2 = secondMoleculeData?.computed_properties || {};
  const solubility1 = firstMoleculeData?.solubility || {};
  const solubility2 = secondMoleculeData?.solubility || {};
  const tox21_properties1 = firstMoleculeData?.tox21_properties || {};
  const tox21_properties2 = secondMoleculeData?.tox21_properties || {};

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol1 = async () => {
      if (viewerRef1.current && firstMoleculeData) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer 1");
        const viewer1 = window.$3Dmol.createViewer(viewerRef1.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors
        });

        const cid1 = computed_properties1.cid;

        try {
          // Fetch molecular data for the CID
          const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid1}/SDF?record_type=2d`
          );
          console.log("response : " + response);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch CID ${cid1}: ${response.statusText}`
            );
          }

          const sdfData1 = await response.text(); // Get SDF data as text
          viewer1.addModel(sdfData1, "sdf");
          viewer1.setStyle({}, { [style1]: {} });
          viewer1.zoomTo();
          viewer1.render();
          console.log(`Successfully loaded CID ${cid1}`);
        } catch (error) {
          console.error(`Error loading model for CID ${cid1}:`, error);
        }
      }
    };
    load3Dmol1();
  }, [firstMoleculeData, style1]);

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol2 = async () => {
      if (viewerRef2.current && secondMoleculeData) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer 2");
        const viewer2 = window.$3Dmol.createViewer(viewerRef2.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors
        });

        const cid2 = computed_properties2.cid;

        try {
          // Fetch molecular data for the CID
          const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid2}/SDF?record_type=2d`
          );
          console.log("response : " + response);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch CID ${cid2}: ${response.statusText}`
            );
          }

          const sdfData2 = await response.text(); // Get SDF data as text
          viewer2.addModel(sdfData2, "sdf");
          viewer2.setStyle({}, { [style2]: {} });
          viewer2.zoomTo();
          viewer2.render();
          console.log(`Successfully loaded CID ${cid2}`);
        } catch (error) {
          console.error(`Error loading model for CID ${cid2}:`, error);
        }
      }
    };
    load3Dmol2();
  }, [secondMoleculeData, style2]);

  return (
    <>
      <button className="homepage-button" onClick={handleHomepageButtonClick}>
        <img src="../../../../molecule.png" alt=""></img>
      </button>
      <div className="compare-container">
        <div className="molecule-view" id="1">
          <button
            className="x-button"
            onClick={() => handleRemove(firstCompound)}
          >
            X
          </button>
          <div className="search">
            <Search whichComponent="first"></Search>
          </div>
          <h2>{computed_properties1.title}</h2>
          <div className="viewer-container1">
            <div className="viewer_3Dmoljs" ref={viewerRef1}></div>
            <div className="controls1">
              <label>
                <select
                  value={style1}
                  onChange={(e) => setStyle1(e.target.value)}
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
              {computed_properties1.title != null && (
                <li>
                  <strong>Title:</strong>
                  <span className="property">{computed_properties1.title}</span>
                </li>
              )}
              {computed_properties1.cid != null && (
                <li>
                  <strong>CID:</strong>
                  <span className="property">{computed_properties1.cid}</span>
                </li>
              )}
              {computed_properties1.IUPACName != null && (
                <li>
                  <strong>IUPAC name:</strong>
                  <span className="property">
                    {computed_properties1.IUPACName}
                  </span>
                </li>
              )}
              {computed_properties1.InChi != null && (
                <li>
                  <strong>InChI:</strong>
                  <span className="property">{computed_properties1.InChi}</span>
                </li>
              )}
              {computed_properties1.InChiKey != null && (
                <li>
                  <strong>InChIKey:</strong>
                  <span className="property">
                    {computed_properties1.InChiKey}
                  </span>
                </li>
              )}
              {computed_properties1.canonicalSMILES != null && (
                <li>
                  <strong>Canonical SMILES:</strong>
                  <span className="property">
                    {computed_properties1.canonicalSMILES}
                  </span>
                </li>
              )}
              {computed_properties1.molecularFormula != null && (
                <li>
                  <strong>Molecular Formula:</strong>
                  <span className="property">
                    {computed_properties1.molecularFormula}
                  </span>
                </li>
              )}
              {computed_properties1.logP != null && (
                <li>
                  <strong>logP:</strong>
                  <span className="property">{computed_properties1.logP}</span>
                </li>
              )}
              {computed_properties1.exactMass != null && (
                <li>
                  <strong>Exact Mass:</strong>
                  <span className="property">
                    {computed_properties1.exactMass + " Da"}
                  </span>
                </li>
              )}
              {computed_properties1.molecularWeight != null && (
                <li>
                  <strong>Molecular Weight:</strong>
                  <span className="property">
                    {computed_properties1.molecularWeight + " g/mol"}
                  </span>
                </li>
              )}
              {computed_properties1.polarSurfaceArea != null && (
                <li>
                  <strong>TPSA:</strong>
                  <span className="property">
                    {computed_properties1.polarSurfaceArea + " Å²"}
                  </span>
                </li>
              )}
              {solubility1 != null && (
                <li>
                  <strong>Solubility:</strong>
                  <span className="property">
                    {solubility1 + " log(mol/L)"}
                  </span>
                </li>
              )}
            </ul>
            <h3>Tox21 Properties:</h3>
            <div className="tox21-properties-grid">
              {Object.entries(tox21_properties1).map(([key, value], index) => (
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

        <div className="molecule-view" id="2">
          <button
            className="x-button"
            onClick={() => handleRemove(secondCompound)}
          >
            X
          </button>
          <div className="search">
            <Search whichComponent="second"></Search>
          </div>
          <h2>{computed_properties2.title}</h2>
          <div className="viewer-container2">
            <div className="viewer_3Dmoljs" ref={viewerRef2}></div>
            <div className="controls2">
              <label>
                <select
                  value={style2}
                  onChange={(e) => setStyle2(e.target.value)}
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
              {computed_properties2.title != null && (
                <li>
                  <strong>Title:</strong>
                  <span className="property">{computed_properties2.title}</span>
                </li>
              )}
              {computed_properties2.cid != null && (
                <li>
                  <strong>CID:</strong>
                  <span className="property">{computed_properties2.cid}</span>
                </li>
              )}
              {computed_properties2.IUPACName != null && (
                <li>
                  <strong>IUPAC name:</strong>
                  <span className="property">
                    {computed_properties2.IUPACName}
                  </span>
                </li>
              )}
              {computed_properties2.InChi != null && (
                <li>
                  <strong>InChI:</strong>
                  <span className="property">{computed_properties2.InChi}</span>
                </li>
              )}
              {computed_properties2.InChiKey != null && (
                <li>
                  <strong>InChIKey:</strong>
                  <span className="property">
                    {computed_properties2.InChiKey}
                  </span>
                </li>
              )}
              {computed_properties2.canonicalSMILES != null && (
                <li>
                  <strong>Canonical SMILES:</strong>
                  <span className="property">
                    {computed_properties2.canonicalSMILES}
                  </span>
                </li>
              )}
              {computed_properties2.molecularFormula != null && (
                <li>
                  <strong>Molecular Formula:</strong>
                  <span className="property">
                    {computed_properties2.molecularFormula}
                  </span>
                </li>
              )}
              {computed_properties2.logP != null && (
                <li>
                  <strong>logP:</strong>
                  <span className="property">{computed_properties2.logP}</span>
                </li>
              )}
              {computed_properties2.exactMass != null && (
                <li>
                  <strong>Exact Mass:</strong>
                  <span className="property">
                    {computed_properties2.exactMass + " Da"}
                  </span>
                </li>
              )}
              {computed_properties2.molecularWeight != null && (
                <li>
                  <strong>Molecular Weight:</strong>
                  <span className="property">
                    {computed_properties2.molecularWeight + " g/mol"}
                  </span>
                </li>
              )}
              {computed_properties2.polarSurfaceArea != null && (
                <li>
                  <strong>TPSA:</strong>
                  <span className="property">
                    {computed_properties2.polarSurfaceArea + " Å²"}
                  </span>
                </li>
              )}
              {solubility2 != null && (
                <li>
                  <strong>Solubility:</strong>
                  <span className="property">
                    {solubility2 + " log(mol/L)"}
                  </span>
                </li>
              )}
            </ul>
            <h3>Tox21 Properties:</h3>
            <div className="tox21-properties-grid">
              {Object.entries(tox21_properties2).map(([key, value], index) => (
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

export default Compare;
