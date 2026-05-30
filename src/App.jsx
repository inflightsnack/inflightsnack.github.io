import { useState, useEffect } from 'react'

class Time {
  constructor(hours = 0, minutes = 0, seconds = 0) {
    this.milliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000
  }

  valueOf() {
    return this.milliseconds
  }
}

export default function App() {
  const targetTimestamp = new Date("2026-06-30T17:30:00").getTime()
  const [timeLeft, setTimeLeft] = useState(targetTimestamp - Date.now())
  const [workTime, setWorkTime] = useState(calculateWorkTime(targetTimestamp, Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetTimestamp - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [targetTimestamp])

  return (
    <main className="page">
      <h1>inflightsnack Home Page</h1>
      <section className="card">
        <p>Total time remaining</p>
        <p className="countdown">{formatTimeLeft(timeLeft)}</p>
        <p>until {new Date(targetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {new Date(targetTimestamp).toLocaleDateString()}.</p>
      </section>
      <section className="card">
        <p>Work time remaining</p>
        <p className="countdown">{formatTimeLeft(workTime)}</p>
        <p>until {new Date(targetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {new Date(targetTimestamp).toLocaleDateString()}.</p>
      </section>
    </main>
  )
}

function formatTimeLeft(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
}

function calculateWorkTime(targetTimestamp, currentTimestamp) {
  const holidays = [
    new Date("2026-06-12"),
    new Date("2026-06-29"),
    new Date("2026-06-30"),
  ]
  function isWorkDay(date) {
    const isHoliday = holidays.some(holiday => holiday.toDateString() === date.toDateString())
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    return !isHoliday && !isWeekend
  }
  // count the days after today, filtering out holidays and weekends
  let _workDays = 0
  let _workTime = 0
  const dayStart = new Time(9, 0, 0)
  const dayEnd = new Time(17, 30, 0)
  const lunchStart = new Time(12, 0, 0)
  const lunchEnd = new Time(13, 0, 0)
  const currentDate = new Date(currentTimestamp)
  const date = new Date(currentTimestamp)
  date.setDate(date.getDate() + 1)
  for (; date <= new Date(targetTimestamp); date.setDate(date.getDate() + 1)) {
    if (isWorkDay(date)) {
      _workDays += 1
    }
  }
  // calculate the work time left in the current day if today is a work day
  if (!isWorkDay(currentDate)) {
    return _workDays * 24 * 3600 * 1000
  } 
  const currentTime = new Time(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds())
  if (currentTime < dayStart) {
    _workDays += 1
  } else if (currentTime >= dayStart && currentTime < lunchStart) {
    _workTime = (dayEnd - currentTime) - (lunchEnd - lunchStart)
  } else if (currentTime >= lunchStart && currentTime < lunchEnd) {
    _workTime = dayEnd - lunchEnd
  } else if (currentTime >= lunchEnd && currentTime < dayEnd) {
    _workTime = dayEnd - currentTime
  }

  return _workDays * (24 * 3600 * 1000) + _workTime
}

