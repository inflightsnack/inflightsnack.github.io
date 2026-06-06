import { useState, useEffect } from 'react'
import { Temporal } from '@js-temporal/polyfill'

const startDate = Temporal.ZonedDateTime.from({
  timeZone: "Europe/London",
  year: 2003,
  month: 12,
  day: 15,
  hour: 9,
  minute: 0,
  second: 0,
})

const target = Temporal.ZonedDateTime.from({
  timeZone: "Europe/London",
  year: 2026,
  month: 6,
  day: 30,
  hour: 17,
  minute: 30,
  second: 0,
});
const targetLocal = target.withTimeZone(Temporal.Now.timeZoneId())

export default function App() {
  const now = Temporal.Now.zonedDateTimeISO(target.timeZoneId)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(target, now))
  const [workTime, setWorkTime] = useState(calculateWorkTime(target, now))
  const [progress, setProgress] = useState(calculateTimelineProgress(startDate, target, now))
  const progressLabel = formatProgressPercent(progress)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Temporal.Now.zonedDateTimeISO(target.timeZoneId)
      setTimeLeft(calculateTimeLeft(target, now))
      setWorkTime(calculateWorkTime(target, now))
      setProgress(calculateTimelineProgress(startDate, target, now))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="page">
      <h1>inflightsnack Home Page</h1>
      <section className="card">
        <p>Total time remaining</p>
        <p className="countdown">{formatTimeLeft(timeLeft)}</p>
        <p>until {formatTargetTime(targetLocal)} on {formatTargetDate(targetLocal)}.</p>
        <div className="progress-block" aria-label="Time elapsed from start date to target">
          <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} aria-valuetext={`${progressLabel} percent elapsed`}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-meta">
            <span>Employment progress</span>
            <span>{progressLabel}%</span>
          </div>
        </div>
      </section>
      <section className="card">
        <p>Work time remaining</p>
        <p className="countdown">{formatTimeLeft(workTime)}</p>
        <p>until {formatTargetTime(targetLocal)} on {formatTargetDate(targetLocal)}.</p>
      </section>
    </main>
  )
}

function formatTimeLeft(duration) {
  const rounded = duration.round({
    largestUnit: 'days',
    smallestUnit: 'second',
    roundingMode: 'floor',
  })
  const days = rounded.days
  const hours = rounded.hours
  const minutes = rounded.minutes
  const seconds = rounded.seconds
  return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
}

function formatTargetTime(zonedDateTime) {
  return zonedDateTime.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function formatTargetDate(zonedDateTime) {
  return zonedDateTime.toLocaleString(undefined, { dateStyle: 'long' })
}

function calculateTimeLeft(targetZonedDateTime, currentZonedDateTime) {
  if (Temporal.ZonedDateTime.compare(currentZonedDateTime, targetZonedDateTime) >= 0) {
    return Temporal.Duration.from({days: 0})
  }
  return currentZonedDateTime.until(targetZonedDateTime, {
    largestUnit: 'days',
    smallestUnit: 'second',
    roundingMode: 'floor',
  })
}

function calculateWorkTime(targetZonedDateTime, currentZonedDateTime) {
  if (Temporal.ZonedDateTime.compare(currentZonedDateTime, targetZonedDateTime) >= 0) {
    return Temporal.Duration.from({days: 0})
  }

  const holidays = new Set(['2026-06-11', '2026-06-12', '2026-06-29', '2026-06-30'])
  function isWorkDay(date) {
    const isHoliday = holidays.has(date.toString())
    const isWeekend = date.dayOfWeek === 6 || date.dayOfWeek === 7
    return !isHoliday && !isWeekend
  }
  // count the days after today, filtering out holidays and weekends
  let _workTime = Temporal.Duration.from({days: 0})
  const currentDate = currentZonedDateTime.toPlainDate()
  const targetDate = targetZonedDateTime.toPlainDate()

  for (let date = currentDate.add({ days: 1 }); Temporal.PlainDate.compare(date, targetDate) <= 0; date = date.add({ days: 1 })) {
    if (isWorkDay(date)) {
      _workTime = _workTime.add(Temporal.Duration.from({ days: 1 }))
    }
  }

  // calculate the work time left in the current day if today is a work day
  if (!isWorkDay(currentDate)) {
    return _workTime
  } 

  const dayStart = Temporal.PlainTime.from('09:00:00')
  const dayEnd = Temporal.PlainTime.from('17:30:00')
  const lunchStart = Temporal.PlainTime.from('12:00:00')
  const lunchEnd = Temporal.PlainTime.from('13:00:00')
  const currentTime = currentZonedDateTime.toPlainTime()
  const lunchDuration = lunchStart.until(lunchEnd, { largestUnit: 'hours' })

  if (Temporal.PlainTime.compare(currentTime, dayStart) < 0) {
    _workTime = _workTime.add(Temporal.Duration.from({ days: 1 }))
  } else if (Temporal.PlainTime.compare(currentTime, lunchStart) < 0) {
    _workTime = _workTime.add(currentTime.until(dayEnd, { largestUnit: 'hours' }).subtract(lunchDuration))
  } else if (Temporal.PlainTime.compare(currentTime, lunchEnd) < 0) {
    _workTime = _workTime.add(lunchEnd.until(dayEnd, { largestUnit: 'hours' }))
  } else if (Temporal.PlainTime.compare(currentTime, dayEnd) < 0) {
    _workTime = _workTime.add(currentTime.until(dayEnd, { largestUnit: 'hours' }))
  }

  return _workTime
}

function calculateTimelineProgress(startZonedDateTime, targetZonedDateTime, currentZonedDateTime) {
  const totalDuration = targetZonedDateTime.epochMilliseconds - startZonedDateTime.epochMilliseconds

  if (totalDuration <= 0) {
    return 100
  }

  const elapsedDuration = currentZonedDateTime.epochMilliseconds - startZonedDateTime.epochMilliseconds
  const clampedElapsed = Math.min(Math.max(elapsedDuration, 0), totalDuration)

  return (clampedElapsed / totalDuration) * 100
}

function formatProgressPercent(progress) {
  return progress.toFixed(1)
}

