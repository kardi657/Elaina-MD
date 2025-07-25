import { webp2mp4File } from "../lib/converter.js"

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let notStickerMessage = `Kirim/Balas Sticker Dengan Command *${usedPrefix + command}*`
        if (!m.quoted) return m.reply(notStickerMessage)
        let q = m.quoted ? m.quoted : m
        let mime = q.mediaType || ''
        if (!/sticker/.test(mime)) return m.reply(notStickerMessage)
        await global.loading(m, conn)
        let media = await q.download(true)
        let { result } = await webp2mp4File(media)
        let { data } = await conn.getFile(result)
        await conn.sendFile(m.chat, data, '', '', m)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['tovideo']
handler.tags = ['sticker']
handler.command = /^(to(vid(eo)?|mp4))$/i
export default handler