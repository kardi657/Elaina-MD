let handler = async (m, { conn, usedPrefix, command, text }) => {
    let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    if (!target) return m.reply(`Reply atau tag orangnya! \n\nContoh : \n${usedPrefix + command} @${m.sender.split("@")[0]}`, false, { mentions: [m.sender] })
    if (target == m.sender) return m.reply("Tidak bisa kick diri sendiri")
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    await delay(2000)
    await m.reply(`Sukses mengeluarkan @${target.split("@")[0]} dari group!`, false, { mentions: [target] })
}
handler.help = ['kick']
handler.tags = ['group']
handler.command = /^(kick)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
export default handler

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))