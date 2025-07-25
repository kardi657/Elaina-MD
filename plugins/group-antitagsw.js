/*
- Fitur: Anti Tag @Grub Ini Disebut
- Info: Dh 100% Ke Fix, Akhirnya Penyakit Grub Ini Disebut Kumat 🤣
- Type: Plugins `ESM`
- By: HamzDxD

- [ `Source` ]
- https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u
*/

import fs from 'fs'

const antiTagSWPath = '/home/container/lib/antitagsw.json' // Atur lokasi penyimpanan database

if (!fs.existsSync(antiTagSWPath)) {
    fs.writeFileSync(antiTagSWPath, '{}', 'utf-8')
}

const loadAntiTagSW = () => JSON.parse(fs.readFileSync(antiTagSWPath, 'utf-8'))
const saveAntiTagSW = (data) => fs.writeFileSync(antiTagSWPath, JSON.stringify(data, null, 4), 'utf-8')

let antiTagSWGroup = loadAntiTagSW()

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply("❌ Cuma bisa dipake di grup.")
    if (!(isAdmin || isOwner)) return m.reply("❌ Lu bukan admin, kaga bisa atur ini.")
    if (!args[0]) return m.reply("⚠️ Gunakan: .antitagsw on/off")

    if (args[0] === "on") {
        if (antiTagSWGroup[m.chat]) return m.reply("😡 Udah nyala")
        antiTagSWGroup[m.chat] = true
        saveAntiTagSW(antiTagSWGroup)
        return m.reply("✅ *Anti Tag Status WhatsApp* sekarang AKTIF di grup ini!")
    } else if (args[0] === "off") {
        if (!antiTagSWGroup[m.chat]) return m.reply("😔 Udah mati")
        delete antiTagSWGroup[m.chat]
        saveAntiTagSW(antiTagSWGroup)
        return m.reply("❌ *Anti Tag Status WhatsApp* dimatikan di grup ini!")
    } else {
        return m.reply("⚠️ Pilih: on/off")
    }
}

handler.before = async (m, { conn, isBotAdmin, isAdmin }) => {
    if (!m.isGroup || !antiTagSWGroup[m.chat]) return
    if (!(m.message?.protocolMessage?.type === 25 || m.type === 25)) return

    let warningMessage = `🚨 *GRUP DITANDAI DI STATUS!* 🤣\n\n` +
                         `😡 *@${m.sender.split("@")[0]}*, lu kenapa nge-tag grup di status?!` +
                         `\n\n *Jangan nge-tag grup di status!🤣*`

    if (!isBotAdmin) {
        return conn.sendMessage(m.chat, { text: warningMessage, mentions: [m.sender] })
    }

    await conn.sendMessage(m.chat, { delete: m.key })
    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
    await conn.sendMessage(m.chat, { text: `❌ *@${m.sender.split("@")[0]}* udah dikeluarin gara-gara ngetag grup di status.`, mentions: [m.sender] })
}

handler.command = ['antitagsw']
handler.group = true
handler.admin = true

export default handler