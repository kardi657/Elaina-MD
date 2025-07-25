import fs from 'fs'
import moment from 'moment-timezone'

let handler = async (m, { conn, command, usedPrefix, text }) => {
    conn.pembayaran = conn.pembayaran || {}
    if (/cancel/i.test(text)) {
        if (typeof conn.pembayaran[m.sender] === "undefined") return m.reply("Kamu Tidak Mempunyai Transaksi Yang Berjalan!")
        m.reply("Berhasil Menghapus Transaksi!")
        clearTimeout(conn.pembayaran[m.sender].expired)
        delete conn.pembayaran[m.sender]
        return
    }
    if (!text) return m.reply(`Masukkan Nominal! \n\nContoh: \n${usedPrefix + command} 1000`)
    if (m.sender in conn.pembayaran) return m.reply("Kamu masih memiliki transaksi yang belum selesai!")
    if (text < 1000) return m.reply("Minimal 1000")
    if (text > 10000000) return m.reply("Maximal 10.000.000")
    
    let randomCode = Math.floor(Math.random() * 100)
    let refID = generateRefID()
    let harga = Number(text) + randomCode
    let caption = `
*TRANSAKSI TELAH DIBUAT*

Nominal : Rp ${toRupiah(harga)}
Type : Deposit
Dibuat : ${formattedDate(Date.now())}
Expired : 10 Menit

_Silahkan Scan QRIS di atas dengan nominal *Rp.${toRupiah(harga)}* yang telah ditentukan! Jika sudah transaksi akan otomatis selesai_

_*Note :* Tidak boleh melebihi atau kurang dari nominal tersebut, karena transaksi dicek oleh BOT!_
`.trim()

    await conn.textOptions(m.chat, caption, fs.readFileSync("./media/qris.jpg"), [[`${usedPrefix + command} cancel`, "Cancel"]], m)
    conn.pembayaran[m.sender] = { chat: m.chat, type: "deposit", refID, code: "deposit", produk: "deposit", harga, number: m.sender.split("@")[0], time: Date.now(),
        expired: setTimeout(() => {
            m.reply("Transaksi telah Expired!")
            delete conn.pembayaran[m.sender]
        }, 600000)
    }
}

handler.help = ["deposit"]
handler.tags = ["topup"]
handler.command = /^(depo(sit)?)$/i
export default handler

function toRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number)
}

function generateRefID() {
    return 'ry-' + Math.random().toString(36).substr(2, 9)
}

function formattedDate(ms) {
    return moment(ms).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm');
}