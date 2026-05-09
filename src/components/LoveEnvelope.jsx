import { useState } from 'react'

function LoveEnvelope() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="letter-section" aria-labelledby="letter-title">
      <div className="section-heading">
        <p className="eyebrow">hidden letter</p>
        <h2 id="letter-title">A letter to open slowly</h2>
        <p className="heading-chinese">一封慢慢打开的信</p>
        <p>Tap the envelope to reveal the card.</p>
        <p className="copy-chinese">轻轻点击信封，打开里面的心意。</p>
      </div>

      <button
        className={`envelope-scene ${isOpen ? 'is-open' : ''}`}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="letter-card">
          {/* Replace this placeholder with the final letter text. */}
          <span>[letter text here]</span>
          <span className="letter-chinese">[信的内容写在这里]</span>
        </span>
        <span className="envelope-body" />
        <span className="envelope-left" />
        <span className="envelope-right" />
        <span className="envelope-flap" />
      </button>
    </section>
  )
}

export default LoveEnvelope
