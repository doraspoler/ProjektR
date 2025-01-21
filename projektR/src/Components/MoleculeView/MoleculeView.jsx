import "./MoleculeView.css";
import React, { useEffect, useRef, useState } from "react";
import Search from "../Homepage/Search.jsx";
import "../Homepage/Search.css";
import { useParams } from "react-router-dom";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import Add from "./Add.jsx";

function MoleculeView() {
  const { title } = useParams();
  const viewerRef = useRef(null);
  const [style, setStyle] = useState("stick"); // Default stil = stick
  //const [spinEnabled, setSpinEnabled] = useState(true); // Defaultno omogućeno okretanje
  //const [spinSpeed, setSpinSpeed] = useState(1); // Default brzina okretanja = 10
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); //Default background bijel
  const [moleculeData, setMoleculeData] = useState(null); // Store molecule data

  const props =
    "Title,IUPACName,InChI,InChIKey,MolecularFormula,CanonicalSMILES,IsomericSMILES,MolecularWeight,XLogP,ExactMass,MonoisotopicMass,TPSA";

  useEffect(() => {
    const fetchMoleculeData = async () => {
      const apiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${title}/property/${props}/JSON`;
      try {
        const response = await fetch(apiUrl);
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
  }, [title]);

  /*
  if (!moleculeData || !moleculeData.PropertyTable || !moleculeData.PropertyTable.Properties) {
    return <p>No molecule data available.</p>;
  }
  */
  //console.log("Ovo je moleculeData u moleculeview " + moleculeData);
  //console.log("Ovo je moleculeDataPropertyTabel",moleculeData.PropertyTable)
  const properties = moleculeData?.PropertyTable?.Properties?.[0] || {};

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol = async () => {
      if (viewerRef.current && moleculeData?.PropertyTable?.Properties) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer");
        const viewer = window.$3Dmol.createViewer(viewerRef.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors,
          backgroundColor,
        });

        const cid = properties.CID;

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
  }, [moleculeData, style, backgroundColor]); //+spinEnabled, spinSpeed,

  //treba ubacit object add na returna ali trenutno baca gresku
  return (
    <>
      <Add />
      <div className="molecule-view">
        <h2>{properties.Title}</h2>
        <div className="search">
          <Search whichComponent="single"></Search>
        </div>

        <div className="view-and-properties">
          <div className="viewer-container">
            <div className="controls">
              <h3>Viewer Controls</h3>
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
              <label>
                Background Color:
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </label>
            </div>
            <div className="viewer_3Dmoljs" ref={viewerRef}></div>
          </div>

          <div className="properties">
            <h2>Molecule Information</h2>
            <ul>
              <li>
                <strong>Title:</strong>
                <span className="property">{properties.Title}</span>
              </li>
              <li>
                <strong>IUPAC name:</strong>
                <span className="property">{properties.IUPACName}</span>
              </li>
              <li>
                <strong>Canonical SMILES:</strong>
                <span className="property">{properties.CanonicalSMILES}</span>
              </li>
              <li>
                <strong>Isomeric SMILES:</strong>
                <span className="property">{properties.IsomericSMILES}</span>
              </li>
              <li>
                <strong>Molecular formula:</strong>
                <span className="property">{properties.MolecularFormula}</span>
              </li>
              <li>
                <strong>XLogP:</strong>
                <span className="property">{properties.XLogP}</span>
              </li>
              <li>
                <strong>Exact mass:</strong>
                <span className="property">{properties.ExactMass}</span>
              </li>
              <li>
                <strong>TPSA:</strong>
                <span className="property">{properties.TPSA}</span>
              </li>
              <li>
                <strong>Molecular weight:</strong>
                <span className="property">
                  {properties.MolecularWeight + " g/mol" || "N/A"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoleculeView;
