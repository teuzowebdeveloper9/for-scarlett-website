import { useEffect, useState } from 'react'
import { FaHeart, FaMoon, FaPaperPlane } from 'react-icons/fa6'
import { createDiaryEntry } from '../services/diaryApi'

const moodOptions = [
  { value: 'soft', label: 'Soft', hint: 'quiet and tender' },
  { value: 'happy', label: 'Happy', hint: 'smiling today' },
  { value: 'missing', label: 'Missing you', hint: 'heart a little far' },
  { value: 'tired', label: 'Tired', hint: 'needs gentle love' },
  { value: 'heavy', label: 'Heavy', hint: 'hard day' },
]

function formatTime(timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())
}

function SleepDiarySection() {
  const [selectedMood, setSelectedMood] = useState(moodOptions[0])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [clocks, setClocks] = useState(() => [
    { label: 'Karina in Kazakhstan', value: formatTime('Asia/Almaty') },
    { label: 'Me in Brazil', value: formatTime('America/Sao_Paulo') },
  ])

  useEffect(() => {
    const updateClocks = () => {
      setClocks([
        { label: 'Karina in Kazakhstan', value: formatTime('Asia/Almaty') },
        { label: 'Me in Brazil', value: formatTime('America/Sao_Paulo') },
      ])
    }

    const timer = window.setInterval(updateClocks, 30000)
    return () => window.clearInterval(timer)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      setStatus('error')
      setMessage('Write a title and a little note first.')
      return
    }

    setStatus('saving')
    setMessage('')

    try {
      await createDiaryEntry({
        mood: selectedMood.label,
        title,
        description,
        authorTimezone: 'Asia/Almaty',
        readerTimezone: 'America/Sao_Paulo',
      })

      setStatus('saved')
      setMessage('Saved. He can read it when he wakes up.')
      setTitle('')
      setDescription('')
      setSelectedMood(moodOptions[0])
    } catch {
      setStatus('error')
      setMessage('I could not save this note right now. Try again in a moment.')
    }
  }

  return (
    <section className="sleep-diary-section" aria-labelledby="sleep-diary-title">
      <div className="sleep-diary-shell">
        <div className="sleep-diary-copy">
          <p className="eyebrow">while I sleep</p>
          <h2 id="sleep-diary-title">Leave me a note for the morning</h2>
          <p>
            A private little diary for your mood, your day, and anything you want me to wake up to.
          </p>
          <p className="sleep-diary-note">
            I can read this on my side when I open the lover page.
          </p>

          <div className="timezone-pair" aria-label="Kazakhstan and Brazil time">
            {clocks.map((clock) => (
              <div key={clock.label}>
                <span>{clock.label}</span>
                <strong>{clock.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <form className="sleep-diary-form" onSubmit={handleSubmit}>
          <div className="sleep-diary-form-top">
            <span className="moon-badge" aria-hidden="true">
              <FaMoon />
            </span>
            <div>
              <strong>Tonight's diary</strong>
              <p>Write it softly. I will see it later.</p>
            </div>
          </div>

          <fieldset className="mood-fieldset">
            <legend>How is your mood?</legend>
            <div className="mood-options">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  className={`mood-option ${selectedMood.value === mood.value ? 'is-active' : ''}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  <span>{mood.label}</span>
                  <small>{mood.hint}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="diary-label">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="Give this note a small title"
            />
          </label>

          <label className="diary-label">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={4000}
              rows={7}
              placeholder="Tell me how your day felt while I am sleeping..."
            />
          </label>

          <div className="sleep-diary-submit-row">
            <p className={`diary-status ${status === 'error' ? 'is-error' : ''}`} aria-live="polite">
              {message || 'Your note will be saved for me to read later.'}
            </p>
            <button className="diary-submit-button" type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? (
                'Saving'
              ) : (
                <>
                  <FaPaperPlane />
                  Save for him
                </>
              )}
            </button>
          </div>

          <div className="diary-privacy-mark">
            <FaHeart aria-hidden="true" />
            <span>Visible to him on /lover</span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SleepDiarySection
