const musicFiles = import.meta.glob('../musics-karina-site/*.{mp3,m4a,wav,ogg}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const coverClasses = ['cover-rose', 'cover-blush', 'cover-night']
const romanticDescriptions = [
  'Feels like a late-night promise wrapped in soft pink light.',
  'Feels like a memory that lingers softly in the air.',
  'Holds the kind of longing that turns into a smile.',
  'Moves like a heartbeat when someone special is near.',
  'Feels tender, warm, and impossible to forget.',
]
const poeticChineseTitles = [
  '温柔心跳',
  '夜色回信',
  '甜蜜回声',
  '想你时刻',
  '专属柔光',
]

const itsYouDescription =
  'I chose this song because I choose you every day. I hope I never regret that, and I know you will not disappoint me.'
const itsYouDescriptionChinese = '我选择这首歌，是因为我每天都会选择你。我希望自己永远不会后悔，因为我知道你不会让我失望。'

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

function parseMusicFile(path, source, index) {
  const fileName = decodeURIComponent(path.split('/').pop() ?? `track-${index + 1}`)
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, '')
  const parts = nameWithoutExtension.split(' - ').map(cleanName).filter(Boolean)

  const artist = parts.length >= 3 ? parts[0] : parts[1] || 'Unknown artist'
  const title = parts.length >= 3 ? parts[1] : parts[0] || `Track ${index + 1}`
  const musicId = slugify(nameWithoutExtension)
  const isItsYou = isItsYouTrack(title, artist, musicId)
  const description = isItsYou ? itsYouDescription : romanticDescriptions[index % romanticDescriptions.length]
  const descriptionChinese = isItsYou
    ? itsYouDescriptionChinese
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
