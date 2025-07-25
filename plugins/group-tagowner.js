let handler = async (m, { conn, groupMetadata }) => {
  if (!m.isGroup) return
  if (m.fromMe) return
  let ownerJIDs = ['16312176248@s.whatsapp.net']
  if (!m.mentionedJid || !m.mentionedJid.some(jid => ownerJIDs.includes(jid))) return
  const videoUrl = 'https://files.catbox.moe/nr0kvn.mp4'
  let war = 5
  let warn = global.db.data.users[m.sender].warn || 0
  if (warn < war) {
    global.db.data.users[m.sender].warn += 1
  }
  let ppuser
  try {
    ppuser = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    ppuser = ''
  }
  let tag = await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: '',
    ptv: true,
    mentions: [m.sender]
  }, { quoted: m })
  await conn.sendMessage(m.chat, {
    text: `*Tolong jangan di tag ya🤣🤣🤣‼️*\n\n𓏵 Peringatan Untuk *@${m.sender.replace(/@.+/, '')}* ( ${warn + 1}/${war} )`,
    mentions: [m.sender],
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: "🚫 Dilarang Tag Ncoss!",
        mediaType: 1,
        thumbnailUrl: ppuser,
        sourceUrl: ''
      }
    }
  }, { quoted: tag })
}
handler.customPrefix = /@/
handler.command = new RegExp
handler.group = true
export default handler