import "./MoleculeView.css";
import React, { useEffect, useRef, useState } from "react";
import Search from "../Homepage/Search.jsx";
import "../Homepage/Search.css";
import { useParams } from "react-router-dom";
import Add from "./Add.jsx";

function MoleculeView() {
  const { searchOption: firstSearchOption, chemCompound } = useParams();
  const viewerRef = useRef(null);
  const [style, setStyle] = useState("stick"); // Default stil = stick
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); //Default background bijel
  const [moleculeData, setMoleculeData] = useState(null); // Store molecule data

  useEffect(() => {
    console.log("Ovo je searchOption:  ", firstSearchOption);
    console.log("Ovo je chemCompound:  ", encodeURIComponent(chemCompound));
    const fetchMoleculeData = async () => {
      const apiUrl = `http://localhost:5000/search`;
      try {
        const requestBody = {
          type: firstSearchOption, 
          query: encodeURIComponent(chemCompound)
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

  console.log(moleculeData)
  const properties = moleculeData || {};
  console.log(properties)

  useEffect(() => {
    //dinamicki loadam 3Dmol.js
    const load3Dmol = async () => {
      if (viewerRef.current && moleculeData) {
        if (!window.$3Dmol) {
          console.error("3Dmol.js library not loaded!");
          return;
        }

        console.log("Inicijaliziram viewer");
        const viewer = window.$3Dmol.createViewer(viewerRef.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors,
          backgroundColor,
        });

        const cid = moleculeData.cid;

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
      <Add firstSearchOption={firstSearchOption} firstCompound={chemCompound} />
      <div className="molecule-view">
        <h2>{properties.title}</h2>
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
                <span className="property">{properties.title}</span>
              </li>
              <li>
                <strong>IUPAC name:</strong>
                <span className="property">{properties.IUPACName}</span>
              </li>
              <li>
                <strong>Canonical SMILES:</strong>
                <span className="property">{properties.canonicalSMILES}</span>
              </li>
              <li>
                <strong>Isomeric SMILES:</strong>
                <span className="property">{properties.isomericSMILES}</span>
              </li>
              <li>
                <strong>Molecular formula:</strong>
                <span className="property">{properties.molecularFormula}</span>
              </li>
              <li>
                <strong>XLogP:</strong>
                <span className="property">{properties.logP}</span>
              </li>
              <li>
                <strong>Exact mass:</strong>
                <span className="property">{properties.exactMass}</span>
              </li>
              <li>
                <strong>TPSA:</strong>
                <span className="property">{properties.polarSurfaceArea}</span>
              </li>
              <li>
                <strong>Molecular weight:</strong>
                <span className="property">
                  {properties.molecularWeight + " g/mol" || "N/A"}
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