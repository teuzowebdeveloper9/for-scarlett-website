import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaHeart, FaPause, FaPlay } from 'react-icons/fa6'

const albumPhotos = [
  {
    src: '/scarlett/close-up-blue-hour.jpeg',
    title: 'Olhar de fim de tarde',
    mood: 'me perde fácil',
    caption: 'Esse olhar tem uma calma bonita demais. É o tipo de foto que eu olho e fico com vontade de chegar mais perto.',
  },
  {
    src: '/scarlett/selfie-outside.jpeg',
    title: 'Meu cabelo favorito',
    mood: 'tão linda sem esforço',
    caption: 'Seu cabelo, seu rosto, esse jeito de tirar foto como se nem soubesse o quanto fica linda. Eu adoro isso em você.',
  },
  {
    src: '/scarlett/glitter-look.jpeg',
    title: 'Brilho de estrela',
    mood: 'parece sonho',
    caption: 'Essa foto parece um pedacinho de céu no seu rosto. Você fica surreal com esse brilho todo, meu amor.',
  },
  {
    src: '/scarlett/soft-room-selfie.jpeg',
    title: 'Jeitinho só seu',
    mood: 'minha saudade aperta',
    caption: 'Tem uma doçura nessa foto que me quebra. Eu olho e só penso em te abraçar, te puxar para perto e ficar ali.',
  },
]

function ScarlettPhotoAlbum() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const activePhoto = albumPhotos[activeIndex]

  const showPhoto = (index) => {
    const nextIndex = (index + albumPhotos.length) % albumPhotos.length
    setActiveIndex(nextIndex)
  }

  useEffect(() => {
    if (!isAutoPlaying) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % albumPhotos.length)
    }, 5600)

    return () => window.clearInterval(timer)
  }, [isAutoPlaying])

  return (
    <section className="album-section reveal-on-scroll" id="photos" aria-labelledby="album-title">
      <div className="album-shell">
        <div className="album-copy">
          <p className="eyebrow">album de fotos</p>
          <h2 id="album-title">Fotos que fazem minha saudade aumentar</h2>
          <p className="album-intro">
            Quatro retratos seus guardados aqui, porque meu coração sempre encontra um detalhe novo para amar em você.
          </p>

          <div className="album-meta" aria-label="Foto atual do album">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <div>
              <strong>{activePhoto.title}</strong>
              <p>{activePhoto.mood}</p>
            </div>
          </div>

          <div className="album-actions" aria-label="Controles do album de fotos">
            <button
              type="button"
              className="album-icon-button"
              onClick={() => showPhoto(activeIndex - 1)}
              aria-label="Foto anterior"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className="album-icon-button album-play-toggle"
              onClick={() => setIsAutoPlaying((current) => !current)}
              aria-label={isAutoPlaying ? 'Pausar album de fotos' : 'Tocar album de fotos'}
            >
              {isAutoPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              type="button"
              className="album-icon-button"
              onClick={() => showPhoto(activeIndex + 1)}
              aria-label="Proxima foto"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="album-stage" style={{ '--album-index': activeIndex }} aria-live="polite">
          <div className="album-frame album-frame-back" aria-hidden="true">
            <img src={albumPhotos[(activeIndex + 1) % albumPhotos.length].src} alt="" />
          </div>
          <figure className="album-frame album-frame-main" key={activePhoto.src}>
            <img src={activePhoto.src} alt={activePhoto.title} />
            <figcaption>
              <FaHeart aria-hidden="true" />
              <span>{activePhoto.caption}</span>
            </figcaption>
          </figure>
          <div className="album-autoplay-bar" aria-hidden="true">
            <span key={`${activePhoto.src}-${isAutoPlaying}`} className={isAutoPlaying ? 'is-running' : ''} />
          </div>
        </div>

        <div className="album-thumbnails" aria-label="Escolher uma foto">
          {albumPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`album-thumb ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => showPhoto(index)}
              aria-label={`Mostrar ${photo.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <img src={photo.src} alt="" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScarlettPhotoAlbum
