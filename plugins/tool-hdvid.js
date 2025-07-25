import { ffmpeg } from '../lib/converter.js'
import fs from 'fs'
let handler = async (m, { conn, text, usedPrefix, args, command }) => {
    try {
        conn.hdvid = conn.hdvid ? conn.hdvid: {}
        let q = m.quoted ? m.quoted: m
        let mime = (q.msg || q).mimetype || ''
        let ephemeral = conn.chats[m.chat]?.metadata?.ephemeralDuration || conn.chats[m.chat]?.ephemeralDuration || false

        if (!mime) return m.reply(`Reply atau kirim video dengan command ${usedPrefix + command}`)
        if (!/video/i.test(mime)) return m.reply('Hanya untuk video!')
        if (m.sender in conn.hdvid) return m.reply('Masih ada proses yang berlangsung...')
        conn.hdvid[m.sender] = true
        let tinggi = q.height
        let lebar = q.width
        let additionalFFmpegOptions = [
            '-c:v',
            'libx264',
            '-crf',
            '5',
            '-b:v',
            '8M',
            '-s',
            lebar * 2 + 'x' + tinggi * 2,
            '-x264opts',
            'keyint=30:min-keyint=30',
            '-q:v',
            '60'
        ]
        await global.loading(m, conn)

        const videoBuffer = await q.download()
        const buff = await videoConvert(videoBuffer, additionalFFmpegOptions)
        const stats = fs.statSync(buff.filename)
        const fileSizeInBytes = stats.size
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
        if (fileSizeInMegabytes > 80) {
            await conn.sendMessage(m.chat, { document: buff.data, fileName: new Date() * 1 + '.mp4', mimetype: 'video/mp4' }, { quoted: m, ephemeralExpiration: ephemeral })
        } else {
            await conn.sendFile(m.chat, buff.data, "", "", m)
        }
    } catch (e) {
        throw e
    } finally {
        delete conn.hdvid[m.sender]
        await global.loading(m, conn, true)
    }
}
handler.help = ['hdvideo']
handler.tags = ['tools']
handler.command = /^(hdvid)$/i
handler.limit = true
export default handler

async function videoConvert(buffer, options = []) {
    return await ffmpeg(buffer, [
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '18',
        '-preset', 'slow',
        '-tune', 'film',
        '-vf', 'scale=1280:-1',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '48000',
        ...options
    ], 'mp4', 'mp4');
}