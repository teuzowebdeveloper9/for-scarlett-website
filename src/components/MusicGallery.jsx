function MusicGallery({ songs }) {
  return (
    <section className="music-section" aria-labelledby="music-title">
      <div className="section-heading">
        <p className="eyebrow">soundtrack</p>
        <h2 id="music-title">Songs that feel like you</h2>
        <p className="heading-chinese">像你一样温柔的歌</p>
        <p>Cards ready for covers, photos, and tiny stories from each moment.</p>
        <p className="copy-chinese">这里可以放封面、照片和每一段回忆的小故事。</p>
      </div>

      <div className="music-grid">
        {songs.map((song) => (
          <article className="music-card" key={song.title}>
            <div className={`music-cover ${song.coverClass}`} aria-hidden="true">
              <span />
            </div>
            <div className="music-card-content">
              <h3>{song.title}</h3>
              <p className="track-chinese">{song.titleChinese}</p>
              <p>{song.description}</p>
              <p className="copy-chinese">{song.descriptionChinese}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MusicGallery
