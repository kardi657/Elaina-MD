import axios from 'axios'

async function identifyAnime(imageBuffer) {
  let form = new FormData()
  form.append('image', new Blob([imageBuffer], { type: 'image/jpeg' }), 'anime.jpg')
  let { data } = await axios.post('https://www.animefinder.xyz/api/identify', form, {
    headers: {
      'Origin': 'https://www.animefinder.xyz',
      'Referer': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1'
    },
    maxBodyLength: Infinity
  })
  return {
    anime: data.animeTitle,
    character: data.character,
    genres: data.genres,
    premiere: data.premiereDate,
    production: data.productionHouse,
    description: data.description,
    synopsis: data.synopsis,
    references: data.references.map(r => r.url || r)
  }
}

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image/')) return m.reply('Berikan Gambar Anime/Fan Art Nya Untuk Di Finder ')
    let img = await q.download()
    let res = await identifyAnime(img)
    let text = `*${res.anime}*\n    
Character Name : ${res.character}
Genre : ${res.genres}
Show Date : ${res.premiere}
Studio : ${res.production}
Description : ${res.description}
Synopsis : ${res.synopsis}
References From : ${res.references.join(', ') || '-'}`

    await conn.sendMessage(m.chat, { image: img, caption: text }, { quoted: m })
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['animefinder']
handler.command = ['animefinder']
handler.tags = ['tools']

export default handler