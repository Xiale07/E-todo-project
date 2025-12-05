# E-Todo

E-Todo est une application web de gestion de tâches accessible depuis n'importe quel appareil. Elle permet à chaque utilisateur de créer un profil personnel et d'organiser ses tâches selon leur priorité et leur statut.

La page principale inclut une **barre de progression dynamique** qui évolue lorsque l'utilisateur marque une tâche comme **Done**. Par défaut, chaque tâche est initialisée avec le statut **Not Started**.

---

## 📚 Sommaire

* 📦 Installation (fichiers + Docker)
* 📁 Arborescence du projet
* 🗄️ Lecture de la base de données
* 🚀 Fonctionnalités
* 🧠 Pistes d'amélioration
* 👥 Crédits
* 🧑‍💻 Contributions

---

## 📦 Installation

1. **Cloner le dépôt :**

```bash
git clone git@github.com:EpitechBachelorPromo2028/B-WEB-101-LIL-1-1-etodo-2.git
```

2. **Installer Docker**

3. **Lancer le projet :**

```bash
docker compose up --build
```

Accéder au site depuis le lien suivant :   http://localhost:5173/

---

## 📁 Arborescence du projet

```text
B-WEB-101-LIL-1-1-etodo-2
├─ .devcontainer/
│  └─ devcontainer.json
│
├─ backend/
│  ├─ .env
│  ├─ db.js
│  ├─ Dockerfile-backend
│  ├─ index.js
│  ├─ middleware/
│  │  └─ auth.js
│  ├─ routes/
│  │  ├─ TodosCreate/
│  │  │  └─ Todos.js
│  │  ├─ todos.js
│  │  └─ user.js
│  └─ server/
│     ├─ server.js
│     └─ wait-for.sh
│
├─ frontend/
│  ├─ Dockerfile-frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ public/
│  └─ src/
│     ├─ assets/react.svg
│     ├─ index.css
│     ├─ main.tsx
│     ├─ AllTodos.tsx
│     ├─ Burger.tsx
│     ├─ TodoItem.tsx
│     ├─ todos.tsx
│     ├─ login.tsx
│     ├─ register.tsx
│     ├─ settings.tsx
│     ├─ profil.tsx
│     ├─ user.tsx
│     └─ users.tsx
│
├─ .env
├─ .gitignore
├─ docker-compose.yml
├─ e-todo.sql
├─ index.js
├─ package.json
└─ README.md
```

---

## 🗄️ 1. Lecture du format de la base de données



1. Ouvrir un terminal puis entrer : 

```bash
docker exec -it database mysql -u root -p
```

Puis :

```sql
root
USE etodo;
DESCRIBE todo;
DESCRIBE user;
```

---

## 🗄️ 2. Lecture des données de la DB

```bash
docker exec -it database mysql -u root -p
```

Puis :

```sql
root
USE etodo;
SELECT * FROM user;
SELECT * FROM todo;
```

---

## 🚀 Fonctionnalités

* Création de tâches
* Modification de tâches
* Suppression de tâches
* Filtrage par statut et priorité
* Compte utilisateur personnel
* Barre de progression dynamique

---

## 🧠 Pistes d'amélioration possibles

* Partage de tâches entre utilisateurs
* Création d'évènements
* Comptes partagés
* Interface calendrier
* Déploiement du site en ligne
* Renforcement de la sécurité

---

## 👥 Crédits

### Frontend

* Clément Spanneut

### Backend

* **User** : Alexis Vallart
* **Todos** : Thybaud Ducorney-Tison && Alexis Vallart

### Remerciements

Bastien, Estelle, Joseph, Leïa, Lucie, Achille, Clément, Julia, Malvina,
Marie-Delphine, Benoît, Juliette, Mathieu, Christophe, Jean-Paul, Anaïs,
Gauthier, Julien, Louison, Laurent, Cathy

---

## 🧑‍💻 Contributions

* Clément Spanneut : [https://github.com/Spanootnoot](https://github.com/Spanootnoot)
* Alexis Vallart : [https://github.com/Xiale07](https://github.com/Xiale07)
* Thybaud Ducorney-Tison : [https://github.com/kazubaruk](https://github.com/kazubaruk)
