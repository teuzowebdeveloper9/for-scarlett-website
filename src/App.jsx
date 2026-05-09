import FloatingMusicPlayer from './components/FloatingMusicPlayer'
import ExperienceLayer from './components/ExperienceLayer'
import Hero from './components/Hero'
import KarinaPhotoAlbum from './components/KarinaPhotoAlbum'
import LoverPage from './components/LoverPage'
import LoveEnvelope from './components/LoveEnvelope'
import MusicGallery from './components/MusicGallery'
import RotatingNeonHeart from './components/RotatingNeonHeart'
import SleepDiarySection from './components/SleepDiarySection'
import SiteSparkles from './components/SiteSparkles'
import { localMusicTracks } from './lib/musicLibrary'
import './App.css'

function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/lover') {
    return (
      <>
        <SiteSparkles quiet />
        <LoverPage />
      </>
    )
  }

  return (
    <main className="site-shell">
      <div className="scroll-glow-progress" aria-hidden="true" />
      <SiteSparkles />
      <ExperienceLayer />
      <FloatingMusicPlayer tracks={localMusicTracks} />
      <Hero />
      <MusicGallery songs={localMusicTracks} />
      <KarinaPhotoAlbum />
      <SleepDiarySection />
      <LoveEnvelope />
      <RotatingNeonHeart />
    </main>
  )
}

export default App
