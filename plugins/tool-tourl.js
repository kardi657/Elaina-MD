import fetch from 'node-fetch';
import FormData from 'form-data';
import {
    fileTypeFromBuffer
} from 'file-type';

let handler = async (m) => {
    try {
        let q = m.quoted ? m.quoted: m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) return m.reply('No media found')
        await global.loading(m, conn)
        let media = await q.download()
        let result = await tourl(media)
        await m.reply(`📮 *L I N K :*
${result}
📊 *S I Z E :* ${media.length} Byte
📛 *E x p i r e d :* No Expiry Date`)
    } catch (e) {
        throw e
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl|upload)$/i

export default handler

async function tourl(buffer) {
    let {
        ext
    } = await fileTypeFromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, "file." + ext);
    bodyForm.append("reqtype", "fileupload");

    let res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: bodyForm,
    });

    let data = await res.text();
    return data;
}