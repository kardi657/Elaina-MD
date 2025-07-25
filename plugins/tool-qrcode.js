/*
- Name : Generator Qrcode
- Deks : Hanya Text Sama Link
- Follow Bang : https://whatsapp.com/channel/0029Vb6D8o67YSd1UzflqU1d
- Source Scrape : https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l/1437
*/
import axios from 'axios'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Berikan Text Atau Link\n *Example :* .qrcode https://abella.icu')

  const isUrl = text.startsWith('http')
  const data = {
    save_qr_code: 'no',
    backcolor: '#FFFFFF',
    frontcolor: '#000000',
    transparent: false,
    gradient: false,
    radial: false,
    gradient_color: '#15a97c',
    marker_out_color: '#000000',
    marker_in_color: '#000000',
    pattern: 'default',
    marker: 'default',
    marker_in: 'default',
    optionlogo: 'none',
    no_logo_bg: true,
    outer_frame: 'none',
    framelabel: 'SCAN ME',
    label_font: 'Arial, Helvetica, sans-serif',
    framecolor: '#000000',
    section: isUrl ? 'link' : 'text',
    link: isUrl ? text : '',
    data: isUrl ? '' : text
  }

  try {
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
    const { data: res } = await axios.post('https://qr.io/generator2/ajax/process-index.php', data, {
      headers: { 'content-type': 'application/json', origin: 'https://qr.io', 'user-agent': 'Mozilla/5.0' }
    })

    const file = `./tmp/qrcode_${Date.now()}.png`
    await sharp(Buffer.from(res.svgcode)).resize(1023, 1023).png().toFile(file)
    await conn.sendMessage(m.chat, { image: { url: file }, caption: '*Done*'}, { quoted: m })
    fs.unlinkSync(file)
  } catch (e) {
    m.reply(e.message || e)
  }
}

handler.help = ['qrcode']
handler.tags = ['tools']
handler.command = ['qrcode']

export default handler