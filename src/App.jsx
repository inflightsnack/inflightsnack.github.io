import { useState, useEffect } from 'react'

export default function App() {
  const targetTimestamp = new Date("2026-06-30T17:00:00").getTime()
  const [timeLeft, setTimeLeft] = useState(targetTimestamp - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetTimestamp - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [targetTimestamp])

  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
  }

  return (
    <main className="page">
      <h1>inflightsnack Home Page</h1>
      <section className="card">
        <p className="countdown">{formatTimeLeft(timeLeft)}</p>
        <p>until 5:00 PM on 30 June 2026.</p>
      </section>
    </main>
  )
}
