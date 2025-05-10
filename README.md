# Cesizen BackOffice

Interface web d’administration développée avec React, Vite, MUI et Clerk pour l’authentification.
Ce back-office permet de gérer les contenus et les utilisateurs de l’application mobile.

---

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Vite](https://vite.dev/)
- [React](https://fr.react.dev/)
- Un compte [Clerk](https://clerk.dev/) configuré

---

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/CecileVexe/CesiZen_BackOffice.git
cd CesiZen_BackOffice
```


### 2. Installer les dépendances

```bash
npm install
# ou
yarn
```

### 3. Configurer les variables d’environnement

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3000
```
### 📌 Les variables doivent être préfixées par VITE_ pour être accessibles dans l’application.

## 🚀 Démarrage

### Lancer en mode développement

```bash
npm run dev
```

## 🔑 Authentification Clerk

L’authentification est gérée avec [Clerk React](https://clerk.com/docs/quickstarts/react) :

- VITE_CLERK_PUBLISHABLE_KEY est requis dans le .env
- L'utilisateur peut se connecter, s'inscrire et accéder à des écrans protégés

## 🎨 UI avec MUI

L’interface est construite avec [Material UI](https://mui.com/) :

Typographie personnalisée via @fontsource

Tableaux avec @mui/x-data-grid

Formulaires via react-hook-form et zod

## 🧾 Licence
### Ce projet est sous licence UNLICENSED.

