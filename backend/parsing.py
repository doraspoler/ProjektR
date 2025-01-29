from pydantic import BaseModel, Field
import numpy as np

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

class Tox21Properties(BaseModel):
    AR: float | None
    ARLBD: float | None = Field(None, alias = "AR-LBD")
    AhR: float | None
    Aromatase: float | None
    ER: float | None
    ERLBD: float | None = Field(None, alias = "ER-LBD")
    PPARgamma: float | None = Field(None, alias = "PPAR-γ")
    ARE: float | None
    ATAD5: float | None
    HSE: float | None
    MMP: float | None
    p53: float | None

    class Config:
        populate_by_name = True
        alias_generator = None   
        allow_population_by_field_name = True

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

def get_tox21_properties(data_tox21_properties: np.ndarray):
    tox21_properties = Tox21Properties(
        AR = data_tox21_properties[0],
        ARLBD = data_tox21_properties[1],
        AhR = data_tox21_properties[2],
        Aromatase = data_tox21_properties[3],
        ER = data_tox21_properties[4],
        ERLBD = data_tox21_properties[5],
        PPARgamma = data_tox21_properties[6],
        ARE = data_tox21_properties[7],
        ATAD5 = data_tox21_properties[8],
        HSE = data_tox21_properties[9],
        MMP = data_tox21_properties[10],
        p53 = data_tox21_properties[11]
    )
    return tox21_properties
