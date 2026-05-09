import FloatingMusicPlayer from './components/FloatingMusicPlayer'
import Hero from './components/Hero'
import LoveEnvelope from './components/LoveEnvelope'
import MusicGallery from './components/MusicGallery'
import RotatingNeonHeart from './components/RotatingNeonHeart'
import { localMusicTracks } from './lib/musicLibrary'
import './App.css'

function App() {
  return (
    <main className="site-shell">
      <div className="scroll-glow-progress" aria-hidden="true" />
      <FloatingMusicPlayer tracks={localMusicTracks} />
      <Hero />
      <MusicGallery songs={localMusicTracks} />
      <LoveEnvelope />
      <RotatingNeonHeart />
    </main>
  )
}

export default App
