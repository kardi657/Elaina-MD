/* 
Fitur : play
Type : ECMAScript modules
Created : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z

#JANGANHAPUSWM
*/
import axios from 'axios';
import fs from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw (`Contoh: ${usedPrefix + command} dj aku meriang`);

    m.reply('Sedang mencari, tunggu sebentar...');

    const apiUrl = 'https://api.fanzoffc.eu.org/api/ytdlbeta/';
    const apiKey = 'FanzOffc';
    const maxAttempts = 20;
    let response = null;

    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            attempt++;

            response = await axios.get(apiUrl, {
                params: {
                    query: text,
                    apikey: apiKey,
                },
            });

            if (response.data && response.data.status) {
                break;
            } else {
                throw new Error('Respon API tidak valid');
            }
        } catch (error) {
            if (attempt === maxAttempts) {
                console.error('Kesalahan setelah percobaan maksimal:', error.message);
                throw `Gagal mendapatkan data setelah ${maxAttempts} percobaan.`;
            }
            console.log(`Percobaan ${attempt} gagal: ${error.message}. Mencoba lagi...`);
        }
    }

    try {
        let {
            title,
            format,
            videoUrl,
            downloadLink,
            searchResult: { thumbnail, duration },
        } = response.data;

        let caption = `*∘ Judul :* ${title}\n`;
        caption += `*∘ Duration :* ${duration}\n`;
        caption += `*∘ Link Video :* ${videoUrl}\n`;

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: 'Klik untuk melihat detail',
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: thumbnail,
                        sourceUrl: videoUrl,
                    },
                },
            },
        }, {});

        const videoPath = `./tmp/${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
        const audioPath = `./tmp/${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;

        const videoResponse = await axios({
            url: downloadLink,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(videoPath);
        videoResponse.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        ffmpeg(videoPath)
            .inputOption('-vn')
            .outputOption('-acodec', 'libmp3lame')
            .outputOption('-preset', 'ultrafast')
            .outputOption('-b:a', '128k')
            .saveToFile(audioPath)
            .on('error', (err) => {
                console.error("Kesalahan saat konversi:", err.message);
                throw 'Gagal mengkonversi video ke audio.';
            })
            .on('end', async () => {
                let audioBuffer = fs.readFileSync(audioPath);
                await conn.sendMessage(
                    m.chat,
                    { mimetype: "audio/mpeg", audio: audioBuffer },
                    { quoted: m }
                );

                fs.unlinkSync(videoPath);
                fs.unlinkSync(audioPath);
            });
    } catch (error) {
        console.error("Error:", error.message);
        throw `Terjadi kesalahan saat memproses permintaan. Coba lagi nanti.\nError: ${error.message}`;
    }
};

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];

export default handler;