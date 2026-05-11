const musicFiles = import.meta.glob('../musics-karina-site/*.{mp3,m4a,wav,ogg}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const coverClasses = ['cover-rose', 'cover-blush', 'cover-night']
const romanticDescriptions = [
  'Essa música parece minha saudade falando baixo no meio da noite.',
  'Essa me faz pensar na sua voz e em como eu queria você mais perto.',
  'Uma música para a distância entre nós e para o amor que continua atravessando tudo.',
  'Isso parece meu coração quando seu nome aparece na tela.',
  'Um lembrete suave de que, mesmo longe, você continua sendo o lugar mais perto do meu coração.',
]
const poeticChineseTitles = [
  '温柔心跳',
  '夜色回信',
  '甜蜜回声',
  '想你时刻',
  '专属柔光',
]

const itsYouDescription =
  'Eu escolhi essa música porque eu escolho você todos os dias. Mesmo com distância, dúvidas e dias difíceis, meu coração ainda volta para você.'
const itsYouDescriptionChinese = '我选择这首歌，是因为我每天都会选择你。我希望自己永远不会后悔，因为我知道你不会让我失望。'
const carsOutsideDescription =
  'Essa música me lembra você porque a distância é a parte mais difícil de te amar. Sempre que eu escuto, penso no quanto eu queria parar de ir embora, ficar perto e viver isso de verdade.'
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
