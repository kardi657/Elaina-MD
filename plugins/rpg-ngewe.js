let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
    let name = await conn.getName(m.sender)

    // Cek dan inisialisasi jika belum ada lastNgewe
    if (!('lastNgewe' in user)) user.lastNgewe = 0
    if (!('ngewe' in user)) user.ngewe = 0

    let cooldown = 300000 // 5 menit
    let elapsed = new Date - user.lastNgewe

    if (elapsed < cooldown) {
        let remaining = clockString(cooldown - elapsed)
        return conn.reply(m.chat, `Kamu terlalu capek buat "ngewe" sekarang...\nCoba lagi dalam *${remaining}*`, m)
    }

    // Kirim pesan awal
    let msg = await conn.sendMessage(m.chat, { text: 'Mencari partner buat ngewe...' })

    // Progres edit message
    setTimeout(() => conn.sendMessage(m.chat, { text: 'Partner ditemukan. Pemanasan dimulai...', edit: msg.key }), 5000)
    setTimeout(() => conn.sendMessage(m.chat, { text: 'Posisi sudah siap. Ngewe sedang berlangsung...', edit: msg.key }), 10000)
    setTimeout(() => conn.sendMessage(m.chat, { text: 'Intensitas meningkat. Suasana makin panas...', edit: msg.key }), 15000)
    setTimeout(() => conn.sendMessage(m.chat, { text: 'Sesi ngewe selesai. Keringetan, tapi puas!', edit: msg.key }), 20000)

    // Reward
    let uang = Math.floor(Math.random() * 20000) + 5000
    let exp = Math.floor(Math.random() * 15000) + 2000

    setTimeout(() => {
        user.money += uang
        user.exp += exp
        user.ngewe += 1
        user.warn += 1 // Opsional
        user.lastNgewe = new Date * 1

        conn.sendMessage(m.chat, {
            text: `*Laporan Ngewe #${user.ngewe}*

Nama: *${name}*
Fee Ngewe: *Rp ${uang.toLocaleString()}*
Exp Didapat: *${exp}*
Peringatan Moral: +1
Review Partner: "Mantap, pengen lagi besok!"`,
            edit: msg.key
        })
    }, 25000)
}

handler.help = ['ngewe']
handler.tags = ['rpg']
handler.command = /^(ngewe)$/i
handler.register = true
handler.premium = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}