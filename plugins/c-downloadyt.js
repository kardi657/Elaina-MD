import axios from 'axios';

const formatAudio = ["mp3", "m4a", "webm", "aac", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

async function cekProgress(id) {
    const config = {
        method: "GET",
        url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    };

    while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
            return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

async function ytdlocean(url, format) {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
        throw new Error("Format yang diberikan tidak valid.");
    }

    const config = {
        method: "GET",
        url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    };

    const response = await axios.request(config);
    if (response.data?.success) {
        const { id, title, info: { image } } = response.data;
        const downloadUrl = await cekProgress(id);
        
        return {
            id,
            title,
            image,
            downloadUrl
        };
    } else {
        throw new Error("Gagal mengambil detail video.");
    }
}

let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply("⚠️ Masukkan link YouTube yang ingin diunduh!");

    let format = "480";  // Default video format
    if (command === 'ytmp3') format = "mp3";  // MP3 format for audio download

    try {
        // React with ♻️ before processing
        await conn.sendMessage(m.chat, {
            react: {
                text: "♻️",
                key: m.key,
            }
        });

        let result = await ytdlocean(text, format);

        let caption = `🎬 *YOUTUBE DOWNLOADER*\n\n` +
                      `📌 *Judul:* ${result.title}\n` +
                      `⏳ *Video ID:* ${result.id}\n` +
                      `🔗 *YouTube:* ${text}\n\n` +
                      `📢 *by bot:* elaina-MD`;

        // Kirim thumbnail + info video
        await conn.sendMessage(m.chat, {
            image: { url: result.image },
            caption: caption
        }, { quoted: m });

        if (command === 'ytmp3') {
            await conn.sendMessage(m.chat, {
                audio: { url: result.downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: `${result.title}.mp3`
            }, { quoted: m });
        } else if (command === 'ytmp4') {
            await conn.sendMessage(m.chat, {
                video: { url: result.downloadUrl },
                mimetype: 'video/mp4',
                fileName: `${result.title}.mp4`
            }, { quoted: m });
        }

        // React with ✅ after process is done
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key,
            }
        });
    } catch (error) {
        console.error(error);
        m.reply("⚠️ Gagal mengambil file, pastikan link yang Anda masukkan benar.");
    }
};

handler.help = ['ytmp4'];
handler.command = ['ytmp4','ytmp3'];
handler.tags = ['downloader'];
export default handler;