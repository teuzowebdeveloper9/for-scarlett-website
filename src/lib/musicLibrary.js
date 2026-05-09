const musicFiles = import.meta.glob('../musics-karina-site/*.{mp3,m4a,wav,ogg}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const coverClasses = ['cover-rose', 'cover-blush', 'cover-night']
const romanticDescriptions = [
  'This song feels like me missing you in the quiet part of the night.',
  'This one makes me think about your voice and the way I wish you were closer.',
  'A song for the distance between us, and for the love that keeps crossing it.',
  'This feels like my heartbeat when your name appears on my screen.',
  'A soft reminder that even far away, you are still the closest thing to my heart.',
]
const poeticChineseTitles = [
  '温柔心跳',
  '夜色回信',
  '甜蜜回声',
  '想你时刻',
  '专属柔光',
]

const itsYouDescription =
  'I chose this song because I choose you every day. Even with distance, doubts, and hard days, my heart still comes back to you.'
const itsYouDescriptionChinese = '我选择这首歌，是因为我每天都会选择你。我希望自己永远不会后悔，因为我知道你不会让我失望。'
const carsOutsideDescription =
  "This song reminds me of you because distance is the hardest part of loving you. Every time I hear it, I think about how much I wish I could stop leaving, stay close, and be with you for real."
const carsOutsideDescriptionChinese = '这首歌让我想起你，因为距离是爱你最难的部分。每次听到它，我都会想，如果我可以不离开，可以留在你身边就好了。'

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanName(value) {
  return value
    .replace(/\s*\((youtube|official audio|official video|audio|video)\)\s*/gi, ' ')
    .replace(/\s*\[[^\]]+\]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isItsYouTrack(title, artist, musicId) {
  const normalizedTitle = title.toLowerCase()
  const normalizedArtist = artist.toLowerCase()

  return (
    musicId.includes('ali-gatie') ||
    normalizedArtist.includes('ali gatie') ||
    normalizedTitle.includes("it's you") ||
    normalizedTitle.includes('its you')
  )
}

function isCarsOutsideTrack(title, artist, musicId) {
  const normalizedTitle = title.toLowerCase()
  const normalizedArtist = artist.toLowerCase()

  return (
    musicId.includes('james-arthur-car-s-outside') ||
    normalizedArtist.includes('james arthur') ||
    normalizedTitle.includes("car's outside") ||
    normalizedTitle.includes('cars outside')
  )
}

function parseMusicFile(path, source, index) {
  const fileName = decodeURIComponent(path.split('/').pop() ?? `track-${index + 1}`)
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, '')
  const parts = nameWithoutExtension.split(' - ').map(cleanName).filter(Boolean)

  const artist = parts.length >= 3 ? parts[0] : parts[1] || 'Unknown artist'
  const title = parts.length >= 3 ? parts[1] : parts[0] || `Track ${index + 1}`
  const musicId = slugify(nameWithoutExtension)
  const isItsYou = isItsYouTrack(title, artist, musicId)
  const isCarsOutside = isCarsOutsideTrack(title, artist, musicId)
  const description = isItsYou
    ? itsYouDescription
    : isCarsOutside
      ? carsOutsideDescription
      : romanticDescriptions[index % romanticDescriptions.length]
  const descriptionChinese = isItsYou
    ? itsYouDescriptionChinese
    : isCarsOutside
      ? carsOutsideDescriptionChinese
      : index % 2 === 0
        ? '像深夜里的心跳，安静又温柔。'
        : '像一段安静停留在心里的温柔，甜而克制。'

  return {
    musicId,
    title,
    titleChinese: poeticChineseTitles[index % poeticChineseTitles.length],
    artist,
    artistChinese: '艺术家',
    description,
    descriptionChinese,
    coverClass: coverClasses[index % coverClasses.length],
    fileName,
    src: source,
  }
}

export const localMusicTracks = Object.entries(musicFiles)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, source], index) => parseMusicFile(path, source, index))
