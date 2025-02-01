# VisiChem

VisiChem je web aplikacija razvijena potrebe kolegija Projekt R od strane studenata Borne Svjetličića, Dore Špoler i Milana Vidakovića pod mentorstvom izv. prof. dr. sc. Mihaele Vranić.
Aplikacija nudi 3D vizualni prikaz traženog kemijskog spoja i relevantna kemijska svojstva. 
Podatci se vuku iz javne kemijske baze podataka PubChem.
Osim toga, aplikacija preko prediktivnih modela pokušava predvidjeti topivost spoja u vodi (pri sobnoj temperaturi) te toksičnost na 12 bioloških receptora.
Modeli su trenirani uz pomoć biblioteke DeepChem na skupovima podataka Delaney (za topivost) i Tox21 (za toksičnost).
