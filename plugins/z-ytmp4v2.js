import axios from 'axios'
import fs from 'fs'
let handler = async (m, { conn, args }) => {
await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
let text = args.join(' ')  
if (!text) return m.reply('Masukkan URL YouTube-nya!\n\nContoh: .ytmp4 https://youtube.com/watch?v=xxxx 360p')

  let [url, quality] = text.split(' ')
  quality = quality || '480p'

  const qualityMap = {
    '1080p': 'Full HD (1080p)',
    '720p': 'HD (720p)',
    '480p': 'SD (480p)',
    '360p': 'Low (360p)',
    '240p': 'Very Low (240p)',
    '144p': 'Tiny (144p)'
  }

  if (!qualityMap[quality]) return m.reply(`Kualitas tidak valid!\n\nGunakan salah satu dari:\n${Object.keys(qualityMap).join(', ')}`)

  try {
    let { data } = await axios.post('https://api.ytmp4.fit/api/video-info', { url }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ytmp4.fit',
        'Referer': 'https://ytmp4.fit/'
      }
    })

    if (!data || !data.title) throw new Error('Gagal mengambil info video.')

    let { title, duration, channel, views, thumbnail } = data

   await conn.sendMessage(m.chat, {
      text: `🎬 *Info Video YouTube:*\n\n📌 Judul: ${title}\n📺 Channel: ${channel}\n⏱ Durasi: ${duration}\n👁 Views: ${views}\n\n⏳ Mengunduh kualitas *${qualityMap[quality]}*...`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: channel,
          thumbnailUrl: thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: url
        }
      }
    }, { quoted: m })

    let videoRes = await axios.post('https://api.ytmp4.fit/api/download', { url, quality }, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream',
        'Origin': 'https://ytmp4.fit',
        'Referer': 'https://ytmp4.fit/',
      }
    })

    if (!videoRes.headers['content-type'].includes('video')) {
      throw new Error('Gagal mengunduh video.')
    }

    let filename = decodeURIComponent(
      (videoRes.headers['content-disposition'] || '').split("filename*=UTF-8''")[1] || `video_${quality}.mp4`
    ).replace(/[\/\\:*?"<>|]/g, '_')

    await conn.sendMessage(m.chat, {
      video: Buffer.from(videoRes.data),
      mimetype: 'video/mp4',
      fileName: filename,
      caption: `✅ *Berhasil mengunduh video!*\n\n📌 Judul: ${title}\n🎞️ Kualitas: ${qualityMap[quality]}\n\nPowered By ncoss`
    }, { quoted: m })

  } catch (err) {
    m.reply(`❌ Error: ${err.message}`)
  }
}
handler.help = ['ytmp4-v2']
handler.command = ['ytmp4-v2']
handler.tags = ['downloader']

export default handler