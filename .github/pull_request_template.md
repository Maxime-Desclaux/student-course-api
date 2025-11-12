# Pull Request – Tests unitaires du `coursesController` et `studentsController`  

##  Description

Les tests utilisent **Jest** avec des **mocks du module `storage`**, afin de vérifier les comportements du contrôleur en isolation.

---

## Changements principaux

- Ajout du fichier de test : `tests/unit/controllers/coursesController.test.js` et `studentsController.tes.js`
- Mise en place des tests unitaires suivants :
  - `listCourses` → pagination et filtrage
  - `getCourse` → gestion du 404 et récupération du cours + étudiants
  - `createCourse` → validation des champs et création
  - `deleteCourse` → gestion du 404, des erreurs et succès (204)
  - `updateCourse` → vérification de l’unicité du titre et mise à jour
- Réinitialisation des mocks avant chaque test (`beforeEach`)
- Utilisation de `jest.mock('../../../src/services/storage')` pour isoler la logique

---

## Type de tests

| Type                  | Détails                                                  |
| --------------------- | -------------------------------------------------------- |
| **Unitaires**         | Tests isolés des contrôleurs, mocks du service `storage` |
| **Pas d’intégration** | Aucun appel HTTP réel ni base de données utilisée        |

---

## Stack technique utilisée

- **Node.js**
- **Jest** pour les tests
- **Mocking avec Jest**
- Architecture MVC :
  - `controllers/`
  - `services/`
  - `tests/`

---

## Résultat attendu

Tous les tests doivent passer :

```bash
npm test
```
