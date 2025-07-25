/**
  @ 🍀 YT MP3 Downloader
  @ 🍀 Source: https://whatsapp.com/channel/0029VbBDTFd6mYPDtnetTK1f
  @ 🍀 Scrape: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C/3588
**/

import axios from 'axios';
import * as cheerio from 'cheerio';

function extractVideoId(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
}

export async function ytmp3(url) {
    if (!url) throw new Error('Masukkan URL YouTube!');
    const videoId = extractVideoId(url);
    const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`  : null;

    try {
        const form = new URLSearchParams();
        form.append('q', url);
        form.append('type', 'mp3');

        const res = await axios.post('https://yt1s.click/search',  form.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://yt1s.click', 
                'Referer': 'https://yt1s.click/', 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            }
        });

        const $ = cheerio.load(res.data);
        const link = $('a[href*="download"]').attr('href');

        if (link) {
            return {
                link,
                title: $('title').text().trim() || 'Unknown Title',
                thumbnail,
                success: true
            };
        }
    } catch (e) {
        console.warn('Gagal YT1S:', e.message);
    }

    try {
        if (!videoId) throw new Error('Video ID tidak valid');
        const payload = {
            fileType: 'MP3',
            id: videoId
        };

        const res = await axios.post('https://ht.flvto.online/converter',  payload, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://ht.flvto.online', 
                'Referer': `https://ht.flvto.online/widget?url=https://www.youtube.com/watch?v=${videoId}`,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13)',
            }
        });

        const data = res?.data;
        if (!data || typeof data !== 'object' || data.status !== 'ok' || !data.link) {
            throw new Error(data.msg || 'Status gagal');
        }

        return {
            link: data.link,
            title: data.title || 'Unknown Title',
            thumbnail,
            filesize: data.filesize || 'Tidak tersedia',
            duration: data.duration || 'Tidak tersedia',
            success: true
        };

    } catch (e) {
        throw new Error(`Gagal menggunakan layanan lain: ${e.message}`);
    }
}

let yeon = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        });
        return conn.sendMessage(m.chat, {
            text: `🎧 *Senpai*, masukkan URL YouTube yang ingin diubah ke audio!  
Contoh: *${usedPrefix + command}* https://youtube.com/watch?v=CVvJp3d8xGQ`
        });
    }

    try {
        await conn.sendMessage(m.chat, {
            react: { text: '⏳', key: m.key }
        });

        const result = await ytmp3(text);

        await conn.sendMessage(m.chat, {
            audio: { url: result.link },
            fileName: result.title.replace(/[^\w\-\.]/g, '_') + '.mp3',
            mimetype: 'audio/mpeg',
            ptt: false,
            contextInfo: {
                externalAdReply: {
                    title: result.title,
                    body: 'Durasi: ' + (result.duration || 'Tidak diketahui'),
                    thumbnailUrl: result.thumbnail,
                    sourceUrl: text,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        });

    } catch (e) {
        console.error('Error:', e.message);
        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        });
        await conn.sendMessage(m.chat, {
            text: `⚠️ *Ups, terjadi kesalahan, Senpai!*  
Fitur ini sedang gangguan, coba lagi nanti ya 😅`
        });
    }
};

yeon.help = ['ytmp3 <url>'];
yeon.tags = ['downloader'];
yeon.command = /^ytmp3v2$/i;
yeon.register = true;
yeon.limit = true;
export default yeon;