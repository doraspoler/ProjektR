import os
os.environ['TF_USE_LEGACY_KERAS'] = 'True'
import deepchem as dc
import numpy as np

def get_solubility_model():
    solubility_tasks, solubility_datasets, solubility_transformers = dc.molnet.load_delaney(featurizer='GraphConv')
    train_dataset, valid_dataset, test_dataset = solubility_datasets

    delaney_model = dc.models.GraphConvModel(n_tasks = 1, mode = 'regression', dropout = 0.2, batch_normalize = False)
    delaney_model.fit(train_dataset, nb_epoch = 100)

    metric = dc.metrics.Metric(dc.metrics.pearson_r2_score)
    print("Training set score:", delaney_model.evaluate(train_dataset, [metric],solubility_transformers))
    print("Test set score:", delaney_model.evaluate(test_dataset, [metric], solubility_transformers))

    return delaney_model

def get_toxicity_model():
    tox21_tasks, tox21_datasets, tox21_transformers = dc.molnet.load_tox21(featurizer = 'ECFP')
    train_dataset, valid_dataset, test_dataset = tox21_datasets

    tox21_model = dc.models.MultitaskClassifier(n_tasks=12, n_features=1024, layer_sizes=[1000])
    tox21_model.fit(train_dataset, nb_epoch = 10)

    metric = dc.metrics.Metric(dc.metrics.roc_auc_score)
    print("Training set score:", tox21_model.evaluate(train_dataset, [metric], tox21_transformers))
    print("Test set score:", tox21_model.evaluate(test_dataset, [metric], tox21_transformers))

    return tox21_model

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