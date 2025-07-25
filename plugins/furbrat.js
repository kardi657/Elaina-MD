//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

import axios from "axios";
import { sticker } from "../lib/sticker.js";
import { execSync } from 'child_process'
import fs from "fs";
import path from "path";

const handler = async (m, {
    conn,
    args,
    text
}) => {
    let style = 1;

    const idMatch = args.find(arg => arg.startsWith('--id'));
    if (idMatch) {
        const idValue = parseInt(idMatch.split('=')[1]);
        if (!isNaN(idValue) && idValue >= 1 && idValue <= 7) {
            style = idValue;
        }
    }

    const isSticker = args.includes('--sticker');
    const isAnimated = args.includes('--animated');
    const prompt = text.replace(/--\w+(\=\w+)?/g, '').trim();

    if (!prompt) {
        return m.reply(`⚠️ Masukkan teks untuk dibuat gambar!\n\nContoh penggunaan:\n*.furbrat Halo Dunia --id=3 --sticker*\n\nOpsi:\n- *--id=<angka>*: Pilih style (1-7, default: 1).\n- *--sticker*: Hasil dikirim sebagai stiker.\n- *--animated*: Untuk membuat stiker animasi.`);
    }

    const apiUrl = `https://fastrestapis.fasturl.link/tool/furbrat?text=${encodeURIComponent(prompt)}&style=${style}&mode=center`;

    try {
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data);

        if (isAnimated) {
            const tempDir = path.join(process.cwd(), 'tmp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

            const framePaths = [];
            const words = prompt.split(' ');

            for (let i = 0; i < words.length; i++) {
                const currentText = words.slice(0, i + 1).join(' ');
                const frameResponse = await axios.get(
                    `https://fastrestapis.fasturl.link/tool/furbrat?text=${encodeURIComponent(currentText)}&style=${style}&mode=center`, {
                        responseType: 'arraybuffer'
                    }
                );

                const framePath = path.join(tempDir, `frame${i}.mp4`);
                fs.writeFileSync(framePath, frameResponse.data);
                framePaths.push(framePath);
            }

            const fileListPath = path.join(tempDir, 'filelist.txt');
            let fileListContent = '';

            for (let i = 0; i < framePaths.length; i++) {
                fileListContent += `file '${framePaths[i]}'\n`;
                fileListContent += `duration 1\n`;
            }

            fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
            fileListContent += `duration 3\n`;

            fs.writeFileSync(fileListPath, fileListContent);

            const outputVideoPath = path.join(tempDir, 'output.mp4');
            // Use ffmpeg to create the animation
            execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=5" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 10 ${outputVideoPath}`);

            const outputStickerPath = path.join(tempDir, 'output.webp');
            execSync(`ffmpeg -i ${outputVideoPath} -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease" -c:v libwebp -lossless 1 -qscale 90 -preset default -loop 0 -an -vsync 0 -s 512x512 ${outputStickerPath}`);

            const stickerBuffer = fs.readFileSync(outputStickerPath);
            await conn.sendMessage(m.chat, {
                sticker: stickerBuffer,
            });

            framePaths.forEach((filePath) => fs.unlinkSync(filePath));
            fs.unlinkSync(fileListPath);
            fs.unlinkSync(outputVideoPath);
            fs.unlinkSync(outputStickerPath);

        } else if (isSticker) {
            const stik = await sticker(false, buffer, global.config.stickpack, global.config.stickauth);
            await conn.sendFile(m.chat, stik, 'sticker.webp', '', m);
        } else {
            await conn.sendFile(m.chat, buffer, 'image.png', 'Berikut hasilnya.', m);
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat membuat gambar.');
    }
};

handler.command = ['furbrat'];
handler.help = ['furbrat'];
handler.tags = ['sticker'];
handler.limit = true;
handler.premium = true;

export default handler;