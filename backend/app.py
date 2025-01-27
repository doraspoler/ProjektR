from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from parsing import get_computed_properties, get_tox21_properties
import os
os.environ['TF_USE_LEGACY_KERAS'] = 'True'
import deepchem as dc
from models import predict_solubility, predict_toxicity

app = Flask(__name__)
CORS(app)

delaney_model = dc.models.GraphConvModel(model_dir="models/delaney", n_tasks = 1, mode = 'regression', dropout = 0.2, batch_normalize = False)
delaney_model.restore()

tox21_model = dc.models.MultitaskClassifier(model_dir="models/tox21", n_tasks=12, n_features=1024, layer_sizes=[1000])
tox21_model.restore()

def fetch_data_by_type(search_type, query):
    base_url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound"
    if search_type == "inchi":
        url = f"{base_url}/inchi/property/Title,IUPACName,InChI,InChIKey,MolecularFormula,CanonicalSMILES,IsomericSMILES,MolecularWeight,XLogP,ExactMass,MonoisotopicMass,TPSA/JSON?inchi={query}"
    elif search_type == "smiles":
        url = f"{base_url}/smiles/property/Title,IUPACName,InChI,InChIKey,MolecularFormula,CanonicalSMILES,IsomericSMILES,MolecularWeight,XLogP,ExactMass,MonoisotopicMass,TPSA/JSON?smiles={query}"
    else:
        url = f"{base_url}/{search_type}/{query}/property/Title,IUPACName,InChI,InChIKey,MolecularFormula,CanonicalSMILES,IsomericSMILES,MolecularWeight,XLogP,ExactMass,MonoisotopicMass,TPSA/JSON"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

@app.route("/search", methods=["POST"])
def search():
    search_type = request.json.get("type")
    query = request.json.get("query")
    print(f"query: {query}, search_type: {search_type}")
    if not search_type or not query:
        return jsonify({"error": "Both 'type' and 'query' parameters are required"})

    try:
        data = fetch_data_by_type(search_type, query)
        computed_properties = get_computed_properties(data["PropertyTable"]["Properties"][0])
        solubility = predict_solubility(delaney_model, computed_properties.canonicalSMILES)
        data_tox21_properties = predict_toxicity(tox21_model, computed_properties.canonicalSMILES)
        tox21_properties = get_tox21_properties(data_tox21_properties)
        response = {
            "computed_properties": computed_properties.model_dump(),
            "solubility": round(solubility[0].item(), 2),
            "tox21_properties": tox21_properties.model_dump()
        }
        print(response)
        return jsonify(response)
    except requests.exceptions.HTTPError as http_error:
        return jsonify({"error": f"HTTP error occured: {http_error}"}), 500
    except Exception as error:
        return jsonify({"error": f"An error occured: {error}"}), 500

if __name__ == '__main__':
    app.run(debug=True)