import os
os.environ['TF_USE_LEGACY_KERAS'] = 'True'
import deepchem as dc
import numpy as np

def predict_solubility(delaney_model, smiles):
    featurizer = dc.feat.graph_features.ConvMolFeaturizer()
    features = featurizer.featurize([smiles]) 

    dataset = dc.data.NumpyDataset(X=features)

    predictions = delaney_model.predict(dataset)

    return predictions[0]  

def predict_toxicity(tox21_model, smiles):
    featurizer = dc.feat.CircularFingerprint(size=1024)  
    features = featurizer.featurize([smiles])  

    dataset = dc.data.NumpyDataset(X=features, y = np.zeros((1,12)), w = np.ones((1,12)))

    predictions = tox21_model.predict(dataset)
    
    return predictions[0, :, 1]