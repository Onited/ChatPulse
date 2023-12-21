# Mémo des Commandes Importantes du Projet

## Base de Données MongoDB

### Installation sur MacOS:
- Installer Xcode Select Tools: `xcode-select --install`
- Installer MongoDB avec Homebrew:
  - Ajouter le repo MongoDB: `brew tap mongodb/brew`
  - Installer MongoDB: `brew install mongodb-community@7.0`

### Gestion du service MongoDB:
- Démarrer MongoDB: `brew services start mongodb/brew/mongodb-community@7.0`
- Arrêter MongoDB: `brew services stop mongodb/brew/mongodb-community@7.0`
- Redémarrer MongoDB: `brew services restart mongodb/brew/mongodb-community@7.0`

### Interagir avec MongoDB:
- Ouvrir le shell MongoDB: `mongo`

## API FastAPI

### Création et Gestion de l'API:
- Source python `source venv/bin/activate`
- Installation de FastAPI et Uvicorn (serveur ASGI): `pip install fastapi uvicorn`
- Lancer l'API: `uvicorn main:app --reload` (Supposant que votre fichier principal est nommé `main.py` et l'instance de FastAPI `app`)

### Structure typique d'un projet FastAPI:
- `main.py`: Fichier principal de l'API.
- `models.py`: Définition des modèles de données.
- `schemas.py`: Définition des schémas Pydantic pour la validation des données.
- `database.py`: Configuration et gestion de la base de données.

## Projet en Général

### Commandes Git Utiles:
- Initialiser un dépôt Git: `git init`
- Cloner un dépôt: `git clone [url]`
- Ajouter des fichiers: `git add .`
- Valider les changements: `git commit -m "message de commit"`
- Pousser les changements: `git push origin [branche]`
- Tirer les derniers changements: `git pull origin [branche]`
