/**
  @ 🌟 Brat Generator
  @ 🌟 Source: https://whatsapp.com/channel/0029VbBDTFd6mYPDtnetTK1f
  @ 🌟 Thx penyedia API~
**/

import axios from 'axios'
import { Sticker } from 'wa-sticker-formatter'

let yeon = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `✨ *Contoh Perintah:* ${usedPrefix + command} Hai Senpai! ❤️`
  
    if (command === 'brat-v2') {
      if (!text) throw `✨ *Contoh Perintah:* ${usedPrefix + command} Hai Senpai! ❤️`
      try {
        await conn.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key
          }
        })
        
        const url = `https://api.nekorinn.my.id/maker/brat-v2?text=${encodeURIComponent(text)}`
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        
        const bratimg = new Sticker(res.data, {
          pack: "✨ My Brat Sticker ✨",
          author: `${m.pushName}`,
          type: 'image/png'
        })
        
        const stikerbuff = await bratimg.toBuffer()
        
        await conn.sendMessage(m.chat, {
          sticker: stikerbuff
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, {
          react: {
            text: "✨",
            key: m.key
          }
        })
      } catch(e) {
        console.log(e)
      }
    }
    
    if (command === 'bratvid-v2') {
      if (!text) throw `✨ *Contoh Perintah:* ${usedPrefix + command} Hai Senpai! ❤️`
      try {
        await conn.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key
          }
        })
        
        const url = `https://flowfalcon.dpdns.org/imagecreator/brat-animated?text=${encodeURIComponent(text)}`
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        
        const bratvid = new Sticker(res.data, {
          pack: "✨ My Brat Sticker ✨",
          author: `${m.pushName}`,
          type: 'full',
          quality: 70
        })
        
        const stikerbuff = await bratvid.toBuffer()
        
        await conn.sendMessage(m.chat, {
          sticker: stikerbuff
        }, { quoted: m })
        await conn.sendMessage(m.chat, {
          react: {
            text: "✨",
            key: m.key
          }
        })
      } catch(e) {
        console.log(e)
      }
    }
    
    if (command === 'bratimg') {
      if (!text) throw `✨ *Contoh Perintah:* ${usedPrefix + command} Hai Senpai! ❤️`
      try {
        const pa = {
	"key": {
        "participant": '0@s.whatsapp.net',
            "remoteJid": "status@broadcast",
		    "fromMe": false,
		    "id": "Halo"
                        },
       "message": {
                    "locationMessage": {
                    "name": `Kana Miyukiako`,
                    "jpegThumbnail": ''
                          }
                        }
                      }
        
        const msg = `💌 *Brat Generator* 💌
🔎 *Your Text:* ${text}

\`\`\`Silahkan Pilih Tipe Brat Generator Yang Tersedia Dengan Klik Button Berikut Ini Ya, Senpai!\`\`\``
        
        await conn.sendMessage(m.chat, {
          text: msg,
          footer: 'Brat Generator - Yeonelle',
          buttons: [
            {
              buttonId: `.brat-v2 ${text}`,
              buttonText: { displayText: "🖼️ Brat Image" }
            },
            {
              buttonId: `.bratvid-v2 ${text}`,
              buttonText: { displayText: "🎥 Brat Video" }
            }
          ]
        })
      } catch(e) {
        console.log(e)
      }
    }
}

yeon.help = ['brat']
yeon.tags = ['sticker']
yeon.command = ['brat-v2', 'bratvid-v2', 'bratimg']
yeon.limit = true
export default yeon