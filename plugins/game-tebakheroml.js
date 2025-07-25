//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

import fetch from 'node-fetch'

let timeout = 120000
let poin = 4999

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml : {}
    let id = m.chat

    if (id in conn.tebakheroml) {
        return m.reply('Masih ada soal belum terjawab di chat ini. Jawablah dulu ya!')
    }

    try {
        // Fetch data dari API
        let res = await fetch(`https://api.siputzx.my.id/api/games/tebakheroml`)
        let json = await res.json()

        if (!json.status) throw `Gagal mengambil data dari API.`

        let data = json.data

        // Kirim Caption (Text) DULU
        await conn.reply(m.chat, `
🎮 *Tebak Hero Mobile Legends!*
Dengarkan suara berikut dan tebak heronya.

⏳ Timeout: ${(timeout / 1000).toFixed(0)} detik
💎 Bonus: ${poin} XP
Ketik *${usedPrefix}herohint* untuk bantuan.
`.trim(), m)

        // Kirim Audio TERPISAH
        await conn.sendFile(m.chat, data.audio, 'tebakheroml.ogg', '', m)

        // Simpan state soal
        conn.tebakheroml[id] = {
            jawab: data.name.toLowerCase(),
            poin: poin,
            attempts: 0,
            timeout: setTimeout(() => {
                if (conn.tebakheroml[id]) {
                    m.reply(`⏰ Waktu habis!\nJawabannya adalah *${data.name}*`)
                    delete conn.tebakheroml[id]
                }
            }, timeout)
        }

    } catch (err) {
        console.error(err)
        m.reply('Terjadi kesalahan saat memulai permainan. Coba lagi nanti.')
    }
}

handler.help = ['tebakheroml']
handler.tags = ['game']
handler.command = /^tebakheroml$/i

handler.limit = true
handler.game = true

export default handler