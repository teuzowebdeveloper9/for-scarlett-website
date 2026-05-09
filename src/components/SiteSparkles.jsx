const siteSparkles = Array.from({ length: 62 }, (_, index) => {
  const left = 3 + ((index * 37) % 94)
  const top = 4 + ((index * 53) % 91)
  const size = 0.18 + ((index * 11) % 8) * 0.045
  const ray = 0.72 + ((index * 13) % 9) * 0.11
  const duration = 4.8 + ((index * 7) % 8) * 0.46
  const delay = -((index * 0.47) % 6.4)
  const drift = index % 2 === 0 ? -0.92 : 0.72
  const opacity = 0.38 + ((index * 5) % 7) * 0.07

  return {
    id: index + 1,
    isBright: index % 9 === 0 || index % 14 === 0,
    style: {
      '--site-sparkle-x': `${left}%`,
      '--site-sparkle-y': `${top}%`,
      '--site-sparkle-size': `${size.toFixed(2)}rem`,
      '--site-sparkle-ray': `${ray.toFixed(2)}rem`,
      '--site-sparkle-duration': `${duration.toFixed(2)}s`,
      '--site-sparkle-delay': `${delay.toFixed(2)}s`,
      '--site-sparkle-drift': `${drift.toFixed(2)}rem`,
      '--site-sparkle-opacity': opacity.toFixed(2),
    },
  }
})

function SiteSparkles({ quiet = false }) {
  return (
    <div className={`site-sparkle-field ${quiet ? 'is-quiet' : ''}`} aria-hidden="true">
      {siteSparkles.map(({ id, isBright, style }) => (
        <span
          key={id}
          className={`site-sparkle ${isBright ? 'is-bright' : ''}`}
          style={style}
        />
      ))}
    </div>
  )
}

export default SiteSparkles
