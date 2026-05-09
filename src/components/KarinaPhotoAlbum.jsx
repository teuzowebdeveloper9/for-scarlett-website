import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaHeart, FaPause, FaPlay } from 'react-icons/fa6'

const albumPhotos = [
  {
    src: '/karinaaaa.jpeg',
    title: 'So chic',
    mood: 'I love this about her',
    caption: 'You look so chic here. I love the way you can turn one photo into something I keep thinking about.',
  },
  {
    src: '/karinaaaaajnjer.jpeg',
    title: 'My lady',
    mood: 'totally in love',
    caption: 'This photo makes me fall for you all over again. You are my lady, and I love that.',
  },
  {
    src: '/karinaklerjegrkg.jpeg',
    title: 'So stylish',
    mood: 'this style is so her',
    caption: 'You look so stylish here. This outfit feels so much like you, and I adore that energy.',
  },
  {
    src: '/685023120_970378345743215_5606483074547247357_n.jpg',
    title: 'So hot',
    mood: 'I wish I could kiss you',
    caption: 'You look so hot in this photo. You sent this one a little while ago, and I adore it. I wish I could kiss you.',
  },
]

function KarinaPhotoAlbum() {
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
          <p className="eyebrow">photo album</p>
          <h2 id="album-title">Photos that make me miss you more</h2>
          <p className="album-intro">
            Four little moments of you, saved here because my heart does not know how to ignore them.
          </p>

          <div className="album-meta" aria-label="Current album photo">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <div>
              <strong>{activePhoto.title}</strong>
              <p>{activePhoto.mood}</p>
            </div>
          </div>

          <div className="album-actions" aria-label="Photo album controls">
            <button
              type="button"
              className="album-icon-button"
              onClick={() => showPhoto(activeIndex - 1)}
              aria-label="Previous photo"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className="album-icon-button album-play-toggle"
              onClick={() => setIsAutoPlaying((current) => !current)}
              aria-label={isAutoPlaying ? 'Pause photo album' : 'Play photo album'}
            >
              {isAutoPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              type="button"
              className="album-icon-button"
              onClick={() => showPhoto(activeIndex + 1)}
              aria-label="Next photo"
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

        <div className="album-thumbnails" aria-label="Choose a photo">
          {albumPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={`album-thumb ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => showPhoto(index)}
              aria-label={`Show ${photo.title}`}
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

export default KarinaPhotoAlbum
