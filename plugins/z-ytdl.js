let handler = async (m, { conn, usedPrefix, args, command, text }) => {
if (!text) throw `*Link, type sama resolusinya mana?*\n\n*Cara penggunaan:*\n${usedPrefix + command} Link Type Resolusinya\n\n*Contoh penggunaan:*\n${usedPrefix + command} https://youtu.be/kUr9ew7FLW8 mp4 480\n\n\n*Resolusi yang tersedia:*\n- 144\n- 240\n- 360\n- 480\n- 720\n- 1080\n\n\n*Resolusi mp3 yang tersedia:*\n- 64\n- 128\n- 192\n- 256`
await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
let [linknyah, type, quality] = text.split(' ')
if (!type || !quality) throw `*[ ⚠️ ] HARAP MASUKKAN TYPE DAN RESOLUSINYA!!*\n\n*Cara penggunaan:*\n${usedPrefix + command} Link Type Resolusinya\n\n*Contoh penggunaan:*\n${usedPrefix + command} https://youtu.be/kUr9ew7FLW8 mp4 480\n\n\n*Resolusi mp4 yang tersedia:*\n- 144\n- 240\n- 360\n- 480\n- 720\n- 1080\n\n\n*Resolusi mp3 yang tersedia:*\n- 64\n- 128\n- 192\n- 256`
let anu = await (await fetch(`https://api.rapikzyeah.biz.id/api/downloader/donlotyete?url=${linknyah}&type=${type}&quality=${quality}`)).json()
if (type === 'mp3') {
  m.reply(`${anu.title}\n\nWait, bot is sending audio`)
    await conn.sendMessage(m.chat, {
        audio: { url: anu.downloadUrl },
        mimetype: 'audio/mpeg'
    }, { quoted: m });
} else {
m.reply(`Wait, bot is sending video`)
    await conn.sendFile(m.chat, anu.downloadUrl, 'anu.mp4', `*Title:* ${anu.title}\nResolution : ${anu.quality}`, m)
}

await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
}
handler.help = ['ytdl']
handler.tags = ['downloader']
handler.command = /^(ytdl)$/i
handler.limit = true
export default handler