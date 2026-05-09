import FloatingMusicPlayer from './components/FloatingMusicPlayer'
import Hero from './components/Hero'
import LoveEnvelope from './components/LoveEnvelope'
import MusicGallery from './components/MusicGallery'
import RotatingNeonHeart from './components/RotatingNeonHeart'
import './App.css'

const featuredSong = {
  title: 'Our melody',
  titleChinese: '我们的旋律',
  artist: 'Karina & me',
  artistChinese: 'Karina 和我',
  coverClass: 'cover-rose',
}

const specialSongs = [
  // Replace these placeholders with real songs, photos/covers, and descriptions later.
  {
    title: 'Special song 01',
    titleChinese: '特别的歌 01',
    description: '[short description here]',
    descriptionChinese: '[简短描述写在这里]',
    coverClass: 'cover-rose',
  },
  {
    title: 'Special song 02',
    titleChinese: '特别的歌 02',
    description: '[short description here]',
    descriptionChinese: '[简短描述写在这里]',
    coverClass: 'cover-blush',
  },
  {
    title: 'Special song 03',
    titleChinese: '特别的歌 03',
    description: '[short description here]',
    descriptionChinese: '[简短描述写在这里]',
    coverClass: 'cover-night',
  },
]

function App() {
  return (
    <main className="site-shell">
      <div className="scroll-glow-progress" aria-hidden="true" />
      <FloatingMusicPlayer song={featuredSong} />
      <Hero />
      <MusicGallery songs={specialSongs} />
      <LoveEnvelope />
      <RotatingNeonHeart />
    </main>
  )
}

export default App
