from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from parsing import get_computed_properties
import urllib.parse

app = Flask(__name__)
CORS(app)

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
        print(computed_properties.model_dump_json())
        return jsonify(computed_properties.model_dump())
    except requests.exceptions.HTTPError as http_error:
        return jsonify({"error": f"HTTP error occured: {http_error}"}), 500
    except Exception as error:
        return jsonify({"error": f"An error occured: {error}"}), 500

if __name__ == '__main__':
    app.run(debug=True)