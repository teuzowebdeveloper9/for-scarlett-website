import { useEffect, useState } from 'react'
import { FaHeart, FaMoon, FaPaperPlane } from 'react-icons/fa6'
import { createDiaryEntry } from '../services/diaryApi'

const moodOptions = [
  { value: 'soft', label: 'Soft', hint: 'I need tenderness' },
  { value: 'happy', label: 'Happy', hint: 'I wish you saw me smile' },
  { value: 'missing', label: 'Missing you', hint: 'I want you close' },
  { value: 'tired', label: 'Tired', hint: 'hold my heart gently' },
  { value: 'heavy', label: 'Heavy', hint: 'stay with me quietly' },
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
      setMessage('Write a title and a little piece of your heart first.')
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
      setMessage('Saved. He will wake up to this little piece of you.')
      setTitle('')
      setDescription('')
      setSelectedMood(moodOptions[0])
    } catch {
      setStatus('error')
      setMessage('I could not save this love note right now. Try again in a moment.')
    }
  }

  return (
    <section className="sleep-diary-section reveal-on-scroll" id="diary" aria-labelledby="sleep-diary-title">
      <div className="sleep-diary-shell">
        <div className="sleep-diary-copy">
          <p className="eyebrow">while I sleep</p>
          <h2 id="sleep-diary-title">Leave your heart here for my morning</h2>
          <p>
            When I am asleep in Brazil, you can leave me a piece of your night from Kazakhstan.
          </p>
          <p className="sleep-diary-note">
            I will read it when I wake up, like a message your heart left beside mine.
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
              <strong>Tonight's little letter</strong>
              <p>Tell me how your heart feels. I will keep it safe.</p>
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
              placeholder="Give this feeling a title"
            />
          </label>

          <label className="diary-label">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={4000}
              rows={7}
              placeholder="Tell me what your heart wanted to say while I was sleeping..."
            />
          </label>

          <div className="sleep-diary-submit-row">
            <p className={`diary-status ${status === 'error' ? 'is-error' : ''}`} aria-live="polite">
              {message || 'Your note will wait here until he wakes up and reads it.'}
            </p>
            <button className="diary-submit-button" type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? (
                'Saving'
              ) : (
                <>
                  <FaPaperPlane />
                  Send to his morning
                </>
              )}
            </button>
          </div>

          <div className="diary-privacy-mark">
            <FaHeart aria-hidden="true" />
            <span>Saved only for him on /lover</span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SleepDiarySection
