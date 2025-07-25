import { sticker } from '../lib/sticker.js'
const cooldown = new Map()
const db = { data: { users: {} } } // Menambahkan definisi db jika belum ada
let handler = async (m, { conn, args }) => {
    const user = m.sender
    const quo = args.length >= 1 ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null
    if (!quo) return m.reply("[❗] Input/reply teks tidak ditemukan!")
    if (cooldown.has(user)) {
        const lastTime = cooldown.get(user)
        const elapsed = (Date.now() - lastTime) / 5000
        if (elapsed < 2) {
            const attempts = db.data.users[user]?.attempts || 0
            db.data.users[user] = { ...(db.data.users[user] || {}), attempts: attempts + 1 }
            if (db.data.users[user].attempts >= 3) {
                db.data.users[user].banned = true
                conn.sendMessage(global.nomorown + '@s.whatsapp.net', {
                    text: `[ LAPORAN KINK ]\n\nSeorang pengguna telah terbanned karena spam .brat 😹:\n* Nickname: ${m.pushName || 'Tidak Diketahui'}\n* Tag: @${user.split('@')[0]}\n* Nomor: ${user.replace(/@.+/, '')}\n\nBebas, mau diapakan.`,
                    contextInfo: { mentionedJid: [user] }
                }, { quoted: m })
                return m.reply("[❗] Anda telah dibanned karena spam!")
            }
            return m.reply(`[❗] Tunggu ${Math.ceil(10 - elapsed)} detik sebelum menggunakan perintah ini lagi.\n\nJika Anda spam fitur ini 3x dalam masa cooldown, Anda akan dibanned dari bot.`)
        }
    }
    cooldown.set(user, Date.now())
    if (db.data.users[user]?.attempts) db.data.users[user].attempts = 0
    // Tambahkan reaksi jam (menunggu)
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
   
    try {
        let url = await sticker(null, `https://myapi-rust.vercel.app/api/maker/brat?text=${encodeURIComponent(quo)}&apikey=Ncoss`, global.packname, global.author)
        await conn.sendFile(m.chat, url, 'sticker.webp', quo, m)
       
        // Tambahkan reaksi centang (selesai)
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (error) {
        console.error(error)
        m.reply("[❗] Terjadi kesalahan saat membuat stiker!")
       
        // Tambahkan reaksi gagal jika terjadi error
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    }
}
handler.help = ['brat']
handler.tags = ['sticker']
handler.command = /^(brat)$/i
handler.group = true
export default handler