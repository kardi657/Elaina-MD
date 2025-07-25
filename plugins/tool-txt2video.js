import axios from 'axios'

let yeon = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        return conn.sendMessage(m.chat, {
            text: `📝 *Senpai*, masukkan prompt untuk membuat video!  
Contoh: *${usedPrefix + command}* Cute Antro Furry Cub`
        })
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
        
        const apiUrl = `https://api.fasturl.link/aiimage/meta?prompt=${encodeURIComponent(text)}&mode=animated`
        const { data } = await axios.get(apiUrl)
        
        if (data.status !== 200 || !data.result?.animated_media?.length) {
            throw new Error('Video tidak tersedia untuk prompt ini')
        }

        const videoUrl = data.result.animated_media[0].url.trim()
        
        let caption = `🎥 *Hasil Video AI* 🎥\n`
        caption += `📘 *Prompt:* ${text}`

        await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    } catch (e) {
        console.error('Error:', e.message)
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        await conn.sendMessage(m.chat, {
            text: `⚠️ *Ups, gagal membuat video, Senpai!*  
${e.message || 'Fitur ini sedang gangguan, coba lagi nanti ya 😅'}`
        })
    }
}

yeon.help = ['text2video <prompt>']
yeon.tags = ['ai']
yeon.command = /^(prompttovideo|prompt2video|texttovideo|text2video)$/i
yeon.register = false
yeon.limit = true
export default yeon