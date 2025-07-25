import axios from 'axios'

import FormData from 'form-data'

async function Uguu(buffer, filename) {

  const form = new FormData()

  form.append('files[]', buffer, { filename })

  let { data } = await axios.post('https://uguu.se/upload.php', form, {

    headers: form.getHeaders(),

  })

  if (!data.files || !data.files[0]) throw new Error('Upload gagal')

  return data.files[0].url

}

let handler = async (m, { conn }) => {

  try {

   await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

    let q = m.quoted ? m.quoted : m

    let mime = (q.msg || q).mimetype || ''

    if (!mime || !mime.startsWith('image/')) throw 'Kirim atau reply gambar saja.'

    let media = await q.download()

    let ext = mime.split('/')[1]

    let filename = `image.${ext}`

    let uploadedUrl = await Uguu(media, filename)

    let upscaleUrl = `https://myapi-rust.vercel.app/api/tools/upscale?url=${encodeURIComponent(uploadedUrl)}`

    await conn.sendMessage(m.chat, {

      image: { url: upscaleUrl },

      caption: `*Done ya*`

    }, { quoted: m })

  } catch (e) {

    await m.reply(`${e}`)

  }

}

handler.help = ['hd']

handler.tags = ['tools']

handler.command = ['remini']

export default handler