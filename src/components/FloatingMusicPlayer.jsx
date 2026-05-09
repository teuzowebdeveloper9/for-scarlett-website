import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchLyricsByMusicId } from '../services/lyricsApi'

const emptyBars = Array.from({ length: 12 }, () => 0.18)

function formatTime(value) {
  if (!Number.isFinite(value)) {
    return '0:00'
  }

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function findActiveLyric(lyrics, currentTime) {
  if (!lyrics.length) {
    return null
  }

  return lyrics.reduce((activeLine, line) => {
    return line.time <= currentTime ? line : activeLine
  }, lyrics[0])
}

function FloatingMusicPlayer({ tracks }) {
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [beatLevel, setBeatLevel] = useState(0)
  const [bars, setBars] = useState(emptyBars)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [lyricsData, setLyricsData] = useState(null)
  const [lyricsStatus, setLyricsStatus] = useState('idle')
  const [shouldResumeAfterTrackChange, setShouldResumeAfterTrackChange] = useState(false)

  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)
  const smoothedBeatRef = useRef(0)

  const currentTrack = tracks[trackIndex]
  const lyrics = lyricsData?.lyrics ?? []
  const activeLyric = useMemo(() => findActiveLyric(lyrics, currentTime), [lyrics, currentTime])
  const fallbackLyric =
    lyricsStatus === 'missing'
      ? ['[lyrics JSON not saved yet]', '[歌词还没有保存]']
      : lyricsStatus === 'error'
        ? ['[lyrics API unavailable]', '[歌词接口暂时不可用]']
        : ['[loading lyrics]', '[正在加载歌词]']

  const stopAnalyser = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const runAnalyser = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) {
      return
    }

    const frequencyData = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(frequencyData)

      const lowEnd = frequencyData.slice(0, 18)
      const average = lowEnd.reduce((sum, value) => sum + value, 0) / Math.max(lowEnd.length, 1)
      const nextBeat = Math.min(1, average / 190)
      smoothedBeatRef.current = smoothedBeatRef.current * 0.82 + nextBeat * 0.18

      const nextBars = emptyBars.map((_, index) => {
        const bin = frequencyData[index * 3] ?? 0
        return Math.max(0.12, Math.min(1, bin / 255))
      })

      setBeatLevel(smoothedBeatRef.current)
      setBars(nextBars)
      animationFrameRef.current = requestAnimationFrame(tick)
    }

    stopAnalyser()
    tick()
  }, [stopAnalyser])

  const setupAudioGraph = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) {
      return
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audio)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 128
      analyserRef.current.smoothingTimeConstant = 0.86
      sourceNodeRef.current.connect(analyserRef.current)
      analyserRef.current.connect(audioContextRef.current.destination)
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
  }, [])

  const playCurrentTrack = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) {
      return
    }

    await setupAudioGraph()
    await audio.play()
    setIsPlaying(true)
    runAnalyser()
  }, [currentTrack, runAnalyser, setupAudioGraph])

  const pauseCurrentTrack = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    stopAnalyser()
    setBeatLevel(0)
    setBars(emptyBars)
  }, [stopAnalyser])

  const togglePlayback = async () => {
    if (isPlaying) {
      pauseCurrentTrack()
      return
    }

    await playCurrentTrack()
  }

  const moveTrack = (direction) => {
    setShouldResumeAfterTrackChange(isPlaying)
    setTrackIndex((current) => {
      const nextIndex = current + direction
      if (nextIndex < 0) {
        return tracks.length - 1
      }
      if (nextIndex >= tracks.length) {
        return 0
      }
      return nextIndex
    })
  }

  useEffect(() => {
    if (!currentTrack) {
      return undefined
    }

    const controller = new AbortController()
    setLyricsStatus('loading')
    setLyricsData(null)

    fetchLyricsByMusicId(currentTrack.musicId, controller.signal)
      .then((data) => {
        setLyricsData(data)
        setLyricsStatus(data ? 'ready' : 'missing')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setLyricsStatus('error')
        }
      })

    return () => controller.abort()
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    stopAnalyser()
    setCurrentTime(0)
    setDuration(0)
    smoothedBeatRef.current = 0
    setBeatLevel(0)
    setBars(emptyBars)
    audio.load()

    if (shouldResumeAfterTrackChange) {
      playCurrentTrack().finally(() => setShouldResumeAfterTrackChange(false))
    }
  }, [currentTrack, playCurrentTrack, shouldResumeAfterTrackChange, stopAnalyser])

  useEffect(() => {
    return () => stopAnalyser()
  }, [stopAnalyser])

  if (!currentTrack) {
    return null
  }

  const beatScale = 1 + beatLevel * 0.16
  const beatGlow = 0.2 + beatLevel * 0.8
  const progress = duration ? `${Math.min(100, (currentTime / duration) * 100)}%` : '0%'

  return (
    <aside
      className={`floating-player ${isMinimized ? 'is-minimized' : ''}`}
      style={{
        '--beat-scale': beatScale,
        '--beat-glow': beatGlow,
        '--beat-shadow-size': `${1.1 + beatLevel * 2.2}rem`,
        '--beat-cover-glow': `${1.8 + beatLevel * 2.4}rem`,
        '--track-progress': progress,
      }}
      aria-label="Music player"
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onEnded={() => moveTrack(1)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />

      <div className={`player-cover ${currentTrack.coverClass}`} aria-hidden="true">
        <span />
      </div>

      {!isMinimized && (
        <>
          <div className="player-details">
            <strong>{lyricsData?.title ?? currentTrack.title}</strong>
            <span>{currentTrack.titleChinese}</span>
            <small>{lyricsData?.artist ?? currentTrack.artist}</small>
          </div>

          <div className="player-controls">
            <button className="icon-button" type="button" aria-label="Previous song" onClick={() => moveTrack(-1)}>
              ‹
            </button>
            <button
              className="icon-button play-button"
              type="button"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              onClick={togglePlayback}
            >
              {isPlaying ? 'II' : '▶'}
            </button>
            <button className="icon-button" type="button" aria-label="Next song" onClick={() => moveTrack(1)}>
              ›
            </button>
          </div>

          <div className="player-progress" aria-hidden="true">
            <span />
          </div>

          <div className="equalizer" aria-label="Audio intensity visualizer">
            {bars.map((value, index) => (
              <span
                key={index}
                style={{
                  height: `${18 + value * 82}%`,
                  opacity: 0.48 + value * 0.52,
                  boxShadow: `0 0 ${0.35 + value * 0.85}rem rgba(255, 95, 159, ${0.12 + value * 0.28})`,
                }}
              />
            ))}
          </div>

          <div className="lyrics-panel" aria-live="polite">
            <p className="lyrics-english">
              {activeLyric?.english ?? fallbackLyric[0]}
            </p>
            <p className="lyrics-chinese">{activeLyric?.chinese ?? fallbackLyric[1]}</p>
          </div>

          <div className="player-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </>
      )}

      {isMinimized && (
        <button
          className="icon-button play-button"
          type="button"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          onClick={togglePlayback}
        >
          {isPlaying ? 'II' : '▶'}
        </button>
      )}

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
