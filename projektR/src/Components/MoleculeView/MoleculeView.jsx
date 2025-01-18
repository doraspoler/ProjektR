
import React from "react";
import './MoleculeView.css'

function MoleculeView() {
    
  const moleculeData = JSON.parse(localStorage.getItem("moleculeData"));  
  console.log("Ovo je moleculeData u moleculeview " + moleculeData);
  console.log("Ovo je moleculeDataPropertyTabel",moleculeData.PropertyTable)
  if (!moleculeData || !moleculeData.PropertyTable || !moleculeData.PropertyTable.Properties) {
    return <p>No molecule data available.</p>;
  }

  const properties = moleculeData.PropertyTable.Properties[0];

  return (
    <div className="molecule-view">
      <h2>Molecule Information</h2>
      <ul>
        <li><strong>IUPAC name:</strong><span className="property">{properties.IUPACName}</span></li>
        <li><strong>SMILES:</strong><span className="property">{properties.CanonicalSMILES}</span></li>
        <li><strong>Molecular formula:</strong><span className="property">{properties.MolecularFormula}</span></li>
        <li><strong>Molecular weight:</strong><span className="property">{properties.MolecularWeight + " g/mol" || "N/A"}</span></li>
        <li><strong>Other Properties:</strong> Additional details can be added here...</li>
      </ul>
    </div>
  );
}

export default MoleculeView;
