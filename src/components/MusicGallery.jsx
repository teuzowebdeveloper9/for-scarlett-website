import { FaPlay } from 'react-icons/fa6'

function openTrack(musicId) {
  window.dispatchEvent(new CustomEvent('karina:play-track', { detail: { musicId } }))
}

function MusicGallery({ songs }) {
  return (
    <section className="music-section" aria-labelledby="music-title">
      <div className="section-heading">
        <p className="eyebrow">soundtrack</p>
        <h2 id="music-title">Songs that feel like you</h2>
        <p className="heading-chinese">像你一样温柔的歌</p>
        <p>Little songs that carry the feeling of us.</p>
        <p className="copy-chinese">每一首都像一段只属于你的小心事。</p>
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
