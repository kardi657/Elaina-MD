/* JANGAN HAPUS WM INI MEK
SCRIPT BY © 𝐅𝐚𝐫𝐢𝐞𝐥
•• contacts: (6287872545804)
•• instagram: @elaraai__
•• group bot: https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
*/

let handler = async (m, { command }) => {
    let id = m.chat
    let vote = global.votingSulap[id]
    if (!vote) return

    let user = m.sender
    let changed = false

    if (command === 'ya') {
        if (vote.tidak.includes(user)) {
            vote.tidak = vote.tidak.filter(v => v !== user)
            changed = true
        }

        if (!vote.ya.includes(user)) {
            vote.ya.push(user)
            m.reply(`${changed ? '🔁 Suara kamu diubah ke *YA*' : '🗳️ Kamu memilih *YA*'}\n✅ Ya: ${vote.ya.length}\n❌ Tidak: ${vote.tidak.length}`)
        } else if (!changed) {
            m.reply("✅ Kamu sudah memilih *YA*.")
        }

    } else if (command === 'tidak') {
        if (vote.ya.includes(user)) {
            vote.ya = vote.ya.filter(v => v !== user)
            changed = true
        }

        if (!vote.tidak.includes(user)) {
            vote.tidak.push(user)
            m.reply(`${changed ? '🔁 Suara kamu diubah ke *TIDAK*' : '🗳️ Kamu memilih *TIDAK*'}\n✅ Ya: ${vote.ya.length}\n❌ Tidak: ${vote.tidak.length}`)
        } else if (!changed) {
            m.reply("✅ Kamu sudah memilih *TIDAK*.")
        }
    }
}

handler.command = /^ya$|^tidak$/i
handler.group = true

export default handler