/* JANGAN HAPUS WM INI MEK
SCRIPT BY © 𝐅𝐚𝐫𝐢𝐞𝐥
•• contacts: (6287872545804)
•• instagram: @elaraai__
•• group bot: https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
*/

global.votingSulap = global.votingSulap || {}

let handler = async (m, { conn, usedPrefix, command, text, participants }) => {
    let id = m.chat

    if (command === 'sulap') {
        let target = m.mentionedJid?.[0] 
            || m.quoted?.sender 
            || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false)

        if (!target) return m.reply(`Tag atau reply orang yang ingin disulap.\n\nContoh:\n${usedPrefix + command} @user`)
        if (target === m.sender) return m.reply("🚫 Tidak bisa sulap diri sendiri.")
        if (target === conn.user.jid) return m.reply("🚫 Tidak bisa sulap bot.")

        const group = await conn.groupMetadata(id)
        const groupParticipants = group.participants.map(p => p.id)
        if (!groupParticipants.includes(target)) return m.reply("❌ Orang tersebut tidak ada di grup.")
        if (global.votingSulap[id]) return m.reply("⚠️ Masih ada voting sulap yang berjalan di grup ini.")

        global.votingSulap[id] = {
            target,
            ya: [],
            tidak: [],
            timeout: setTimeout(async () => {
                let vote = global.votingSulap[id]
                let yesVotes = vote.ya.length
                let noVotes = vote.tidak.length

                if (yesVotes > noVotes) {
                    const efek = [
                        "✨🎩 Selamat datang di pertunjukan sulap malam ini!",
                        "🔮 Kita akan melakukan sesuatu yang luar biasa...",
                        "🧙‍♂️ Perhatikan baik-baik...",
                        "🎩 Abracadabra...",
                        "💥 *Poof!* Anggota menghilang dari grup..."
                    ]

                    for (let teks of efek) {
                        await m.reply(teks)
                        await delay(1500)
                    }

                    await conn.groupParticipantsUpdate(id, [vote.target], 'remove')
                    await conn.sendMessage(id, {
                        text: `✅ @${vote.target.split("@")[0]} telah disulap keluar dari grup.`,
                        mentions: [vote.target]
                    })
                } else {
                    m.reply(`⏳ Voting selesai!\n\nHasil:\n✅ Ya: ${yesVotes}\n❌ Tidak: ${noVotes}\n\n📛 Sulap dibatalkan.`)
                }

                delete global.votingSulap[id]
            }, 180000)
        }

        conn.sendMessage(id, {
            text: `🎩 Voting untuk mengeluarkan @${target.split("@")[0]}!\nKetik *.ya* untuk setuju\nKetik *.tidak* untuk menolak.\n\nVoting berlangsung selama 3 menit.`,
            mentions: [target]
        })
    }

    else if (command === 'unsulap') {
        let isAdmin = participants.find(p => p.id === m.sender)?.admin
        if (!isAdmin) return m.reply("❌ Hanya admin yang bisa melakukan *unsulap*.")

        let target = m.mentionedJid?.[0] 
            || m.quoted?.sender 
            || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false)

        if (!target) return m.reply(`Siapa yang mau dikembalikan? Tag atau reply orangnya.`)

        const groupName = await conn.getName(m.chat)
        const link = await conn.groupInviteCode(m.chat)
        let url = `https://chat.whatsapp.com/${link}`

        try {
            await conn.sendMessage(target, {
                text: `🔔 Kamu telah diundang kembali ke grup *${groupName}*.\nKlik link berikut untuk bergabung kembali:\n${url}`
            })

            await m.reply(`✅ Undangan telah dikirim ke @${target.split("@")[0]}.\n🔓 Menunggu mereka bergabung kembali...`, false, { mentions: [target] })

            await conn.sendMessage(m.chat, {
                text: `✨ @${target.split("@")[0]} telah di- *unsulap* oleh admin dan diundang kembali ke grup.`,
                mentions: [target]
            })
        } catch (e) {
            m.reply("⚠️ Gagal mengirim undangan. Mungkin pengguna telah memblokir bot.")
        }
    }
}

handler.command = /^sulap$|^unsulap$/i
handler.help = ['sulap', 'unsulap']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))