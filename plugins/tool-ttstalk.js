/* 
• Plugins Stalking TikTok
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
• Source Scrape: https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21
*/

import axios from 'axios'

const handler = async (m, { conn, args, text, command }) => {
  const username = (args[0] || '').replace(/^@/, '')
  if (!username) {
    return conn.sendMessage(m.chat, {
      text: 'Masukkan username TikTok.\n\nContoh:\n*.ttstalk mrbeast*'
    }, { quoted: m })
  }

  try {
    const res = await axios.post(
      'https://tokviewer.net/api/check-profile',
      { username },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )

    const data = res.data?.data
    if (!data) throw new Error('Data tidak ditemukan.')

    const caption = `
\`T I K T O K - S T A L K I N G\`
• Username: @${username}
• Followers: ${data.followers.toLocaleString()} 
• Following: ${data.following.toLocaleString()} 
• Likes: ${data.likes.toLocaleString()}
`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: data.avatar },
      caption
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, {
      text: `Gagal mengambil profil TikTok.\n\n*Username:* @${username}\n*Error:* ${err.message}`
    }, { quoted: m })
  }
}

handler.help = ['ttstalk <username>']
handler.tags = ['tools']
handler.command = /^ttstalk$/i

export default handler