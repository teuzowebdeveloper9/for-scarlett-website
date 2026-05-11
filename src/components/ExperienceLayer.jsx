import { useEffect, useState } from 'react'
import { FaEnvelopeOpenText, FaHeart, FaHouse, FaImages, FaMusic } from 'react-icons/fa6'

const moments = [
  { id: 'home', label: 'Inicio', icon: FaHouse },
  { id: 'songs', label: 'Musicas', icon: FaMusic },
  { id: 'photos', label: 'Fotos', icon: FaImages },
  { id: 'letter', label: 'Carta', icon: FaEnvelopeOpenText },
  { id: 'heart', label: 'Coracao', icon: FaHeart },
]

function ExperienceLayer() {
  const [activeMoment, setActiveMoment] = useState(moments[0].id)

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visibleEntry?.target.id) {
          setActiveMoment(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-32% 0px -44% 0px',
        threshold: [0.18, 0.32, 0.56],
      },
    )

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
      },
    )

    moments.forEach(({ id }) => {
      const section = document.getElementById(id)

      if (section) {
        sectionObserver.observe(section)
        revealObserver.observe(section)
      }
    })

    const revealChildren = document.querySelectorAll('.music-card, .album-stage, .handwritten-letter, .heart-stage')
    revealChildren.forEach((item) => revealObserver.observe(item))

    const pointerQuery = window.matchMedia('(pointer: fine)')
    const handlePointerMove = (event) => {
      if (!pointerQuery.matches) {
        return
      }

      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
    }

    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      sectionObserver.disconnect()
      revealObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  const visitMoment = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="experience-nav" aria-label="Secoes da experiencia da Scarlett">
      <span className="experience-nav-mark">For S</span>
      <div className="experience-nav-items">
        {moments.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`experience-nav-button ${activeMoment === id ? 'is-active' : ''}`}
            onClick={() => visitMoment(id)}
            aria-label={`Go to ${label}`}
            aria-current={activeMoment === id ? 'true' : undefined}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default ExperienceLayer
