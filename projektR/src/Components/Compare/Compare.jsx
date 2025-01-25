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

    navigate(`/molecule/${searchOption}/${remainingCompound}`);
  };

  const viewerRef1 = useRef(null);
  const [style1, setStyle1] = useState("stick"); // Default stil = stick
  const [backgroundColor1, setBackgroundColor1] = useState("#FFFFFF"); //Default background bijel

  const viewerRef2 = useRef(null);
  const [style2, setStyle2] = useState("stick"); // Default stil = stick
  const [backgroundColor2, setBackgroundColor2] = useState("#FFFFFF"); //Default background bijel

  const [firstMoleculeData, setFirstMoleculeData] = useState(null); // Store molecule data
  const [secondMoleculeData, setSecondMoleculeData] = useState(null); // Store molecule data

  const properties =
    "Title,IUPACName,InChI,InChIKey,MolecularFormula,CanonicalSMILES,IsomericSMILES,MolecularWeight,XLogP,ExactMass,MonoisotopicMass,TPSA";

  useEffect(() => {
    const fetchFirstMoleculeData = async () => {
      //dohvaćanje prve molekule
      const apiUrl1 = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${firstSearchOption}/${firstCompound}/property/${properties}/JSON`;
      try {
        const response = await fetch(apiUrl1);
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
      const apiUrl2 = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${secondSearchOption}/${secondCompound}/property/${properties}/JSON`;
      try {
        const response = await fetch(apiUrl2);
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

  const properties1 = firstMoleculeData?.PropertyTable?.Properties?.[0] || {};
  const properties2 = secondMoleculeData?.PropertyTable?.Properties?.[0] || {};

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol1 = async () => {
      if (viewerRef1.current && firstMoleculeData?.PropertyTable?.Properties) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer 1");
        const viewer1 = window.$3Dmol.createViewer(viewerRef1.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors,
          backgroundColor1,
        });

        const cid1 = properties1.CID;

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
  }, [firstMoleculeData, style1, backgroundColor1]);

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol2 = async () => {
      if (viewerRef2.current && secondMoleculeData?.PropertyTable?.Properties) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer 2");
        const viewer2 = window.$3Dmol.createViewer(viewerRef2.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors,
          backgroundColor2,
        });

        const cid2 = properties2.CID;

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
  }, [secondMoleculeData, style2, backgroundColor2]);

  return (
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
        <h2>{properties1.Title}</h2>
        <div className="viewer-container1">
          <div className="controls1">
            <h3>Viewer Controls</h3>
            <label>
              Style:
              <select
                value={style1}
                onChange={(e) => setStyle1(e.target.value)}
              >
                <option value="stick">Stick</option>
                <option value="sphere">Sphere</option>
              </select>
            </label>
            <label>
              Background Color:
              <input
                type="color"
                value={backgroundColor1}
                onChange={(e) => setBackgroundColor1(e.target.value)}
              />
            </label>
          </div>
          <div className="viewer_3Dmoljs" ref={viewerRef1}></div>
        </div>

        <div className="properties">
          <h2>Molecule Information</h2>
          <ul>
            <li>
              <strong>Title:</strong>
              <span className="property">{properties1.Title}</span>
            </li>
            <li>
              <strong>IUPAC name:</strong>
              <span className="property">{properties1.IUPACName}</span>
            </li>
            <li>
              <strong>Canonical SMILES:</strong>
              <span className="property">{properties1.CanonicalSMILES}</span>
            </li>
            <li>
              <strong>Isomeric SMILES:</strong>
              <span className="property">{properties1.IsomericSMILES}</span>
            </li>
            <li>
              <strong>Molecular formula:</strong>
              <span className="property">{properties1.MolecularFormula}</span>
            </li>
            <li>
              <strong>XLogP:</strong>
              <span className="property">{properties1.XLogP}</span>
            </li>
            <li>
              <strong>Exact mass:</strong>
              <span className="property">{properties1.ExactMass}</span>
            </li>
            <li>
              <strong>TPSA:</strong>
              <span className="property">{properties1.TPSA}</span>
            </li>
            <li>
              <strong>Molecular weight:</strong>
              <span className="property">
                {properties1.MolecularWeight + " g/mol" || "N/A"}
              </span>
            </li>
          </ul>
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
        <h2>{properties2.Title}</h2>
        <div className="viewer-container2">
          <div className="controls2">
            <h3>Viewer Controls</h3>
            <label>
              Style:
              <select
                value={style2}
                onChange={(e) => setStyle2(e.target.value)}
              >
                <option value="stick">Stick</option>
                <option value="sphere">Sphere</option>
              </select>
            </label>
            <label>
              Background Color:
              <input
                type="color"
                value={backgroundColor2}
                onChange={(e) => setBackgroundColor2(e.target.value)}
              />
            </label>
          </div>
          <div className="viewer_3Dmoljs" ref={viewerRef2}></div>
        </div>

        <div className="properties">
          <h2>Molecule Information</h2>
          <ul>
            <li>
              <strong>Title:</strong>
              <span className="property">{properties2.Title}</span>
            </li>
            <li>
              <strong>IUPAC name:</strong>
              <span className="property">{properties2.IUPACName}</span>
            </li>
            <li>
              <strong>Canonical SMILES:</strong>
              <span className="property">{properties2.CanonicalSMILES}</span>
            </li>
            <li>
              <strong>Isomeric SMILES:</strong>
              <span className="property">{properties2.IsomericSMILES}</span>
            </li>
            <li>
              <strong>Molecular formula:</strong>
              <span className="property">{properties2.MolecularFormula}</span>
            </li>
            <li>
              <strong>XLogP:</strong>
              <span className="property">{properties2.XLogP}</span>
            </li>
            <li>
              <strong>Exact mass:</strong>
              <span className="property">{properties2.ExactMass}</span>
            </li>
            <li>
              <strong>TPSA:</strong>
              <span className="property">{properties2.TPSA}</span>
            </li>
            <li>
              <strong>Molecular weight:</strong>
              <span className="property">
                {properties2.MolecularWeight + " g/mol" || "N/A"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Compare;
