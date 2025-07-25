/*
Name : Spotify Search 
Type : Plugin ESM
Sumber : https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11
*/

import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `• *Example :* ${usedPrefix + command} melukis senja`
  conn.sendMessage(m.chat, {
		react: {
			text: '',
			key: m.key,
		}
	})
  const respon = await fetch(`https://jazxcode.biz.id/search/spotifys?text=${text}`)
  const res = await respon.json()
  const hasil = `• Title: *${res.result[0].nama}*
• Artis: *${res.result[0].artis}*
• Duration: *${res.result[0].durasi}*
• Rillis: *${res.result[0].rilis}*

• Image: *${res.result[0].image}*
• Link: *${res.result[0].link}*
`
  await conn.reply(m.chat, hasil, m);
}

handler.command = handler.help = ['spotifysearch','spotifys']
handler.tags = ['internet']

export default handler