import { useMemo, useState } from 'react'

function RotatingNeonHeart() {
  const [burstSeed, setBurstSeed] = useState(0)

  const burstHearts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: `${burstSeed}-${index}`,
        left: 18 + ((index * 11 + burstSeed * 7) % 64),
        delay: (index % 4) * 0.08,
        duration: 1.8 + (index % 3) * 0.28,
        size: 0.7 + (index % 4) * 0.14,
        xShift: ((index % 5) - 2) * 1.15,
        rotation: (index % 6) * 18,
      })),
    [burstSeed],
  )

  const triggerBurst = () => {
    setBurstSeed((current) => current + 1)
  }

  return (
    <section className="heart-section" aria-labelledby="heart-title">
      <div className="section-heading">
        <p className="eyebrow">the last light</p>
        <h2 id="heart-title">My heart is yours, Karina</h2>
        <p className="heading-chinese">我的心属于你，Karina</p>
        <button className="karina-burst-chip" type="button" onClick={triggerBurst} aria-label="Release hearts for Karina">
          Karina
        </button>
      </div>

      <button className="heart-stage" type="button" aria-label="3D neon heart" onClick={triggerBurst}>
        <span className="heart-burst-layer" aria-hidden="true">
          {burstHearts.map((heart) => (
            <span
              key={heart.id}
              className="burst-heart"
              style={{
                left: `${heart.left}%`,
                '--burst-delay': `${heart.delay}s`,
                '--burst-duration': `${heart.duration}s`,
                '--burst-size': heart.size,
                '--burst-shift': `${heart.xShift}rem`,
                '--burst-rotation': `${heart.rotation}deg`,
              }}
            >
              ❤
            </span>
          ))}
        </span>
        <span className="neon-heart" aria-hidden="true">
          <span className="heart-core" />
          <span className="heart-rim heart-rim-one" />
          <span className="heart-rim heart-rim-two" />
          <span className="heart-glow" />
        </span>
      </button>
    </section>
  )
}

export default RotatingNeonHeart
