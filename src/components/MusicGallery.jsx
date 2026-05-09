function MusicGallery({ songs }) {
  return (
    <section className="music-section" aria-labelledby="music-title">
      <div className="section-heading">
        <p className="eyebrow">soundtrack</p>
        <h2 id="music-title">Songs that feel like you</h2>
        <p className="heading-chinese">像你一样温柔的歌</p>
        <p>Local songs are loaded from <code>src/musics-karina-site</code>.</p>
        <p className="copy-chinese">把歌曲放进这个文件夹，播放器会自动找到它们。</p>
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
