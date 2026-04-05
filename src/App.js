import React from "https://esm.sh/react@18";

export default function App() {
  const targetTimestamp = new Date("2026-06-30T17:00:00").getTime();
  const [timeLeft, setTimeLeft] = React.useState(targetTimestamp - Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetTimestamp - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };


  return React.createElement(
    "main",
    { className: "page" },
    React.createElement("h1", null, "inflightsnack Home Page"),
    React.createElement(
      "section",
      { className: "card" },
      React.createElement("p", { className: "countdown" }, formatTimeLeft(timeLeft)),
      React.createElement("p", null, "until 5:00 PM on 30 June 2026.")
    )
  );
}
