import { useState } from 'react'

function FloatingMusicPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <aside className={`floating-player ${isMinimized ? 'is-minimized' : ''}`} aria-label="Music player">
      <div className={`player-cover ${song.coverClass}`} aria-hidden="true">
        <span />
      </div>

      {!isMinimized && (
        <div className="player-details">
          <strong>{song.title}</strong>
          <span>{song.titleChinese}</span>
          <small>{song.artist} · {song.artistChinese}</small>
        </div>
      )}

      <button
        className="icon-button play-button"
        type="button"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        onClick={() => setIsPlaying((current) => !current)}
      >
        {isPlaying ? 'II' : '▶'}
      </button>

      <button
        className="icon-button minimize-button"
        type="button"
        aria-label={isMinimized ? 'Expand player' : 'Minimize player'}
        onClick={() => setIsMinimized((current) => !current)}
      >
        {isMinimized ? '+' : '−'}
      </button>
    </aside>
  )
}

export default FloatingMusicPlayer
