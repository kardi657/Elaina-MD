let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    let target = m.mentionedJid[0] ? m.mentionedJid[0]: m.quoted ? m.quoted.sender: args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net': false
    if (!target) return m.reply(`Tag User Atau Masukan Nomornya\n\nContoh :\n${usedPrefix + command} @${m.sender.split('@')[0]} 4`, false, { mentions: [m.sender] })
    if (isOwner) {
        let user = global.db.data.users[target]
        if (args[1]) {
            if (isNaN(args[1])) return m.reply('Hanya Angka!')
            m.reply(`Sukses Membanned @${target.split('@')[0]} Selama ${args[1]} Hari`, false, { mentions: [target] })
            let jumlahHari = 86400000 * args[1]
            user.bannedTime = Math.max(Date.now(), user.bannedTime) + jumlahHari
            user.banned = true
        } else {
            m.reply(`Sukses Membanned @${target.split('@')[0]}`, false, { mentions: [target] })
            user.bannedTime = 17
            user.banned = true
        }
    } else {
        let footer = `_Sekarang @${target.split("@")[0]} Tidak Bisa Menggunakan Bot Di Group Ini!_`
        let user = global.db.data.chats[m.chat].member[target]
        if (args[1]) {
            if (isNaN(args[1])) return m.reply('Hanya Angka!')
            m.reply(`Sukses Membanned @${target.split('@')[0]} Selama ${args[1]} Hari \n${footer}`, false, { mentions: [target] })
            let jumlahHari = 86400000 * args[1]
            user.bannedTime = Math.max(Date.now(), user.bannedTime) + jumlahHari
            user.banned = true
        } else {
            m.reply(`Sukses Membanned @${target.split('@')[0]}, \n${footer}`, false, { mentions: [target] })
            user.bannedTime = 17
            user.banned = true
        }
    }
}
handler.help = ['banned']
handler.tags = ['group']
handler.command = /^(ban(user)?|banned(user)?)$/i
handler.admin = true
export default handler