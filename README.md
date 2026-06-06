# inflightsnack.github.io

This project has been migrated from a no-build React setup to a Vite + React workflow.

## Migration summary

The app previously ran React directly in the browser with no bundler and manual static serving. It now uses Vite for local development and production builds.

### What changed

- Added a Node-based toolchain with `vite` and `@vitejs/plugin-react`.
- Switched to JSX entry/component files:
	- `src/main.js` -> `src/main.jsx`
	- `src/App.js` -> `src/App.jsx`
- Updated `index.html` to load Vite's module entry (`/src/main.jsx`).
- Added npm scripts for development, build, and preview.
- Production output is now generated in `dist/`.

## Project structure

- `index.html`: app shell and root mount node
- `src/main.jsx`: React bootstrap
- `src/App.jsx`: main app component
- `src/styles.css`: styles
- `vite.config.js`: Vite config with React plugin
- `package.json`: dependencies and scripts

## Local setup

### Requirements

- Node.js 18+ (recommended: current LTS)
- npm (bundled with Node.js)

### Install dependencies

```bash
npm install
```

Also run this to install the dev dependencies:

```bash
npm install --include=dev
```

### Start development server

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`).

## Build process

Create a production build:

```bash
npm run build
```

This runs `vite build` and outputs optimized static assets to `dist/`.

The build is currently verified and succeeds in this repository.

## Preview production build locally

After building:

```bash
npm run preview
```

This serves the `dist/` output so you can validate production behavior before deployment.

## Deployment note

Deploy the generated contents of `dist/` to your static hosting target (for example, GitHub Pages publishing from a build artifact).
