# inflightsnack.github.io

This project is scaffolded to run client-side React components directly in the browser (no build step required).

## Structure

- `index.html` mounts the React app
- `src/main.js` bootstraps React
- `src/App.js` contains the main component
- `src/styles.css` contains page styles

## Run locally

Serve this folder with any static file server.

Examples:

- Python: `python3 -m http.server 8080`
- VS Code Live Server extension

Then open `http://localhost:8080`.

## Edit React components

Update `src/App.js` and add more component modules under `src/`.

Because this scaffold avoids a bundler, components currently use `React.createElement` instead of JSX.

## Optional: migrate to Vite later

When Node.js/npm is installed, you can migrate to a Vite + JSX workflow for a better developer experience.
