from pydantic import BaseModel

class ComputedProperties(BaseModel):
    cid: int
    title: str
    IUPACName: str | None
    InChi: str
    InChiKey: str
    molecularFormula: str
    canonicalSMILES: str | None
    isomericSMILES: str | None
    molecularWeight: float | None
    logP: float | None
    exactMass: float | None
    monoisotopicMass: float | None
    polarSurfaceArea: float | None

def get_computed_properties(data_computed_properties: dict):
    computed_properties = ComputedProperties(
    cid = data_computed_properties['CID'],
    title = data_computed_properties['Title'],
    IUPACName = data_computed_properties.get('IUPACName'),
    InChi = data_computed_properties['InChI'],
    InChiKey = data_computed_properties['InChIKey'],
    molecularFormula = data_computed_properties['MolecularFormula'],
    canonicalSMILES = data_computed_properties.get('CanonicalSMILES'),
    isomericSMILES = data_computed_properties.get('IsomericSMILES'),
    molecularWeight = data_computed_properties.get('MolecularWeight'),
    logP = data_computed_properties.get('XLogP'),
    exactMass = data_computed_properties.get('ExactMass'),
    monoisotopicMass = data_computed_properties.get('MonoisotopicMass'),
    polarSurfaceArea = data_computed_properties.get('TPSA') 
    )
    return computed_properties