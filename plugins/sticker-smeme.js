import axios from 'axios';
import FormData from 'form-data';
import {
    fileTypeFromBuffer
} from 'file-type';
import { sticker } from "../lib/sticker.js";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let teks = text.split('|')
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply(`Balas Gambar Dengan Perintah\n\n${usedPrefix + command} ${teks[0] ? teks[0] : 'teks atas'} | ${teks[1] ? teks[1] : 'teks bawah'}`);
    if (!/image\/(jpe?g|png|webp)/.test(mime)) throw `Mime ${mime} tidak didukung!`
    try {
    await global.loading(m, conn)
    let img = await q.download()
    let url = await tourl(img);
    
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(teks[0] ? teks[0] : ' ')}/${encodeURIComponent(teks[1] ? teks[1] : ' ')}.png?background=${url}`
    let stiker = await sticker(false, meme, global.config.stickpack, global.config.stickauth)

    if (stiker) await conn.sendFile(m.chat, stiker, '', null, m)
} catch (e) {
throw e
} finally {
await global.loading(m, conn, true)
}
}
handler.help = ['smeme']
handler.tags = ['tools']
handler.command = /^(smeme)$/i

handler.limit = true

export default handler

async function tourl(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('file', buffer, {
    filename: new Date() * 1 + '.' + ext,
    contentType: mime,
  });
  const { data } = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
    headers: { ...form.getHeaders() },
  });
  const result = data.data.url.split('org')[1];
  return `https://tmpfiles.org/dl${result}`;
}