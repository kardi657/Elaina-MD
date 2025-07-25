let handler = async (m, { conn, usedPrefix, command, args, isOwner }) => {
    let target = m.mentionedJid[0] ? m.mentionedJid[0]: m.quoted ? m.quoted.sender: args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net': false
    if (!target) return m.reply(`Tag User Atau Masukan Nomornya\n\nContoh :\n${usedPrefix + command} @${m.sender.split('@')[0]}`, false, { mentions: [m.sender] })
    if (isOwner) {
        let user = global.db.data.users[target]
        if (typeof user == "undefined") return m.reply("User tidak ada di Database!")
        if (!user.banned) return m.reply('User tidak Terbanned!!')
        await m.reply(`Berhasil Unbanned @${target.split('@')[0]}`, false, { mentions: [target] })
        user.banned = false
        user.bannedTime = 0
    } else {
        let user = global.db.data.chats[m.chat].member[target]
        if (typeof user == "undefined") return m.reply("User tidak ada di Database!")
        if (!user.banned) return m.reply('User tidak Terbanned!!')
        await m.reply(`Berhasil Unbanned @${target.split('@')[0]}`, false, { mentions: [target] })
        user.banned = false
        user.bannedTime = 0
    }
}
handler.help = ['unbanned']
handler.tags = ['group']
handler.command = /^(unban(ned)?(user)?)$/i
handler.admin = true
export default handler