/*

- Fitur: Deepimg

- Info: Generate Image from api deepimg

- Type: Plugins `ESM`& `CJS`

- By: SkyWalker

- [ `SUMBER` ]

- https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u

*/

import axios from 'axios'


let handler = async (m, { conn, text }) => {

  if (!text) return m.reply("Masukkan prompt gambar.")

  await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});

  let imageUrl = await generateImage(text)

  if (!imageUrl) return m.reply("gagal membuat gambarnya coba ganti prompt nya")

  await conn.sendMessage(m.chat, { 

    image: { url: imageUrl }, 

    caption: `Gambar berhasil dibuat!\n Dengan Prompt: ${text}` 

  }, { quoted: m })

}

handler.help = ['deepimg']

handler.command = /^deepimg$/i

handler.tags = ['tools']

export default handler


async function generateImage(prompt) {

  try {

    let { data } = await axios.post("https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev", {

      prompt,

      size: "1024x1024",

      device_id: `dev-${Math.floor(Math.random() * 1000000)}`

    }, {

      headers: {

        "Content-Type": "application/json",

        Origin: "https://deepimg.ai",

        Referer: "https://deepimg.ai/"

      }

    })

    return data?.data?.images?.[0]?.url || null

  } catch (err) {

    console.error(err.response ? err.response.data : err.message)

    return null

  }

}