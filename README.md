# Fish Guessing Game (Arvaa kala!)

A simple web-based game where you guess the names of common Finnish fish species based on their pictures.

## Live Demo

You can play the game live here: [https://vcorr.github.io/fishgame/](https://vcorr.github.io/fishgame/)

## Features

*   Guess the fish species from an image.
*   Choose from 3 options (one correct, two incorrect).
*   Score tracking: +10 points for correct, -10 points for incorrect.
*   Each fish is shown only once per game.
*   "Valmista!" (Finished!) screen shows final score.
*   Option to play again.
*   Interface language: Finnish.

## Tech Stack

*   [React](https://react.dev/) (with TypeScript)
*   [Vite](https://vitejs.dev/) for development and building
*   CSS Modules for styling

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vcorr/fishgame.git
    cd fishgame
    ```
2.  **Install dependencies:**
    ```bash
    # Make sure you have a compatible Node.js version (e.g., v20+)
    # nvm use v20 # If using nvm
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or the next available port).

## Building

To create a production build in the `dist` folder:

```bash
npm run build
```

## Deployment (GitHub Pages)

This project is configured for deployment to GitHub Pages.

1.  Ensure `vite.config.ts` has the correct `base` path (`/fishgame/`).
2.  Ensure `package.json` has the `deploy` and `predeploy` scripts.
3.  Run the deployment script:
    ```bash
    npm run deploy
    ```
    This will build the project and push the contents of the `dist` folder to the `gh-pages` branch.

4.  Make sure GitHub Pages is enabled in your repository settings, configured to deploy from the `gh-pages` branch.
