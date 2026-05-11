import { FaPlay } from 'react-icons/fa6'

function openTrack(musicId) {
  window.dispatchEvent(new CustomEvent('scarlett:play-track', { detail: { musicId } }))
}

function MusicGallery({ songs }) {
  return (
    <section className="music-section reveal-on-scroll" id="songs" aria-labelledby="music-title">
      <div className="section-heading">
        <p className="eyebrow">trilha sonora</p>
        <h2 id="music-title">As músicas que eu tocaria para você</h2>
        <p className="heading-chinese">我想放给你听的歌</p>
        <p>Cada faixa é um jeito pequeno de segurar sua mão mesmo de longe.</p>
        <p className="copy-chinese">每一首歌都像我隔着距离轻轻牵住你的手。</p>
      </div>

      <div className="music-grid">
        {songs.map((song) => (
          <article className="music-card" key={song.musicId}>
            <div className={`music-cover ${song.coverClass}`} aria-hidden="true">
              <span className="music-cover-heart" />
              <button
                className="song-play-button"
                type="button"
                aria-label={`Play ${song.title}`}
                onClick={() => openTrack(song.musicId)}
              >
                <FaPlay />
              </button>
            </div>
            <div className="music-card-content">
              <h3>{song.title}</h3>
              <p className="track-chinese">{song.titleChinese}</p>
              <div className="music-description">
                <p>{song.description}</p>
                <p className="copy-chinese">{song.descriptionChinese}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MusicGallery
