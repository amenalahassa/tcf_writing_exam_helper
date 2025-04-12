## Assistant au test de la langue française TCF - Expression écrite

### Explication

Le test de la langue française TCF (Test de Connaissance du Français) est un examen standardisé qui évalue le niveau de compétence en français des candidats. L'expression écrite est l'une des compétences évaluées dans ce test. Elle consiste à rédiger un texte en réponse à une consigne donnée, en respectant les règles de grammaire, de syntaxe et de vocabulaire.
Ce projet vise à aider les candidats à se préparer à l'épreuve d'expression écrite du TCF en fournissant un format de test similaire à celui de l'examen officiel. 

### Technologies utilisées
- Parcel
- Typescript
- OpenAI API

### Utilisation
1. Clonez le dépôt sur votre machine locale.
2. Installez les dépendances en exécutant `npm install`.
3. Configurez votre clé API OpenAI dans le fichier `src/constants/env.json` en copyant le fichier `env.template.json` et en le renommant en `env.json`.
4. Lancez le projet

`npm start` pour démarrer le serveur de développement. Il va ouvrir la version intégrant openAI. 

`npm start:basic` pour démarrer la version basique sans openAI.

`npm start:with_form` pour démarrer la version avec un formulaire permettant de definir le minimum et le maximum de mots.

5. Ouvrez votre navigateur et accédez à `http://localhost:1234` pour voir l'application en action.


### Licence
Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le distribuer, tant que vous conservez la mention de la licence d'origine.