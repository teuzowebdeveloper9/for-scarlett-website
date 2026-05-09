import { useState } from 'react'
import { FaArrowLeft, FaLock, FaMoon, FaRotateRight } from 'react-icons/fa6'
import { fetchDiaryEntries } from '../services/diaryApi'

function formatEntryTime(value, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value))
}

function LoverPage() {
  const [password, setPassword] = useState('')
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('locked')
  const [message, setMessage] = useState('')

  const loadEntries = async (event) => {
    event?.preventDefault()

    if (!password.trim()) {
      setStatus('error')
      setMessage('Type the private password first, my love.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const data = await fetchDiaryEntries(password.trim())
      setEntries(data)
      setStatus('ready')
      setMessage('')
    } catch (error) {
      setEntries([])
      setStatus('error')
      setMessage(error.message === 'Invalid password' ? 'Wrong password.' : 'Could not load the diary right now.')
    }
  }

  return (
    <main className="lover-page">
      <a className="lover-back-link" href="/" aria-label="Back to the main site">
        <FaArrowLeft />
        Back
      </a>

      <section className="lover-hero" aria-labelledby="lover-title">
        <div>
          <p className="eyebrow">private morning page</p>
          <h1 id="lover-title">The words she left for my morning</h1>
          <p>
            A private place for the pieces of her heart that travel from Kazakhstan to Brazil while I sleep.
          </p>
        </div>

        <form className="lover-password-card" onSubmit={loadEntries}>
          <div className="lover-password-heading">
            <span aria-hidden="true">
              <FaLock />
            </span>
            <div>
              <strong>Only for us</strong>
              <p>A small lock for the messages I do not want the world to touch.</p>
            </div>
          </div>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter our private password"
            />
          </label>

          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Opening' : 'Open her letters'}
          </button>

          {message && <p className="lover-auth-message">{message}</p>}
        </form>
      </section>

      <section className="lover-diary-list" aria-label="Karina diary entries">
        <div className="lover-list-top">
          <div>
            <p className="eyebrow">saved notes</p>
            <h2>My morning with her</h2>
          </div>
          {status === 'ready' && (
            <button type="button" className="lover-refresh-button" onClick={loadEntries}>
              <FaRotateRight />
              Refresh
            </button>
          )}
        </div>

        {status !== 'ready' && (
          <div className="lover-empty-state">
            <FaMoon aria-hidden="true" />
            <p>Unlock the page to read what her heart left here.</p>
          </div>
        )}

        {status === 'ready' && entries.length === 0 && (
          <div className="lover-empty-state">
            <FaMoon aria-hidden="true" />
            <p>No love notes yet. I will wait for her words.</p>
          </div>
        )}

        {status === 'ready' && entries.length > 0 && (
          <div className="lover-entry-stack">
            {entries.map((entry) => (
              <article className="lover-entry-card" key={entry.id}>
                <div className="lover-entry-meta">
                  <span>{entry.mood}</span>
                  <div>
                    <small>Kazakhstan: {formatEntryTime(entry.createdAt, entry.authorTimezone)}</small>
                    <small>Brazil: {formatEntryTime(entry.createdAt, entry.readerTimezone)}</small>
                  </div>
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default LoverPage
