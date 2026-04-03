import React from "https://esm.sh/react@18";

export default function App() {
  return React.createElement(
    "main",
    { className: "page" },
    React.createElement("h1", null, "Inflightsnack"),
    React.createElement(
      "p",
      null,
      "React is running client-side in this GitHub Pages project."
    ),
    React.createElement(
      "section",
      { className: "card" },
      React.createElement("h2", null, "Next step"),
      React.createElement("p", null, "Edit src/App.js to add your components.")
    )
  );
}
