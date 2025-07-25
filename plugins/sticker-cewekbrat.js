import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

registerFont('./src/font/Roboto-Bold.ttf', { family: 'Agus' }); //sesuaikan

async function Brats(teks) {
    const folderna = './lib/';
    if (!fs.existsSync(folderna)) fs.mkdirSync(folderna, { recursive: true });

    const file_path = `${folderna}${Math.random().toString(36).slice(2, 6)}.jpg`;

    const response = await axios.get('https://files.catbox.moe/vkoaby.jpg', { responseType: 'arraybuffer' });
    fs.writeFileSync(file_path, Buffer.from(response.data));

    try {
        const img = await loadImage(file_path);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const paper_x = img.width * 0.285;
        const paper_y = img.height * 0.42;
        const paper_width = img.width * 0.42;
        const paper_height = img.height * 0.32;

        let font_size = Math.min(paper_width / 7.5, paper_height / 3.5);
        ctx.font = `${font_size}px Agus`;
        ctx.fillStyle = 'black';

        const max_width = paper_width * 0.88;
        let words = teks.split(' ');
        let lines = [];
        let line = '';

        for (let word of words) {
            let test_line = line + (line ? ' ' : '') + word;
            let test_width = ctx.measureText(test_line).width;

            if (test_width > max_width && line) {
                lines.push(line);
                line = word;
            } else {
                line = test_line;
            }
        }
        if (line) lines.push(line);

        while (lines.length * font_size > paper_height * 0.85) {
            font_size -= 2;
            ctx.font = `${font_size}px Agus`;

            let tmp_lines = [];
            let tmp_line = '';
            for (let word of words) {
                let test_line = tmp_line + (tmp_line ? ' ' : '') + word;
                let test_width = ctx.measureText(test_line).width;

                if (test_width > max_width && tmp_line) {
                    tmp_lines.push(tmp_line);
                    tmp_line = word;
                } else {
                    tmp_line = test_line;
                }
            }
            if (tmp_line) tmp_lines.push(tmp_line);
            lines = tmp_lines;
        }

        let line_height = font_size * 1.15;
        let text_height = lines.length * line_height;

        let textStartY = paper_y + (paper_height - text_height) / 2 + (lines.length > 2 ? 270 : 275);

        ctx.save();
        ctx.translate(paper_x + paper_width / 2 + 24, textStartY);
        ctx.rotate(0.12);

        ctx.textAlign = 'center';

        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 0, i * line_height);
        }
        ctx.restore();

        return canvas.toBuffer();
    } finally {
        if (fs.existsSync(file_path)) fs.unlinkSync(file_path);
    }
}

const handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan teks yang ingin ditulis!';

    try {
        await global.loading(m, conn)
        const gambar = await Brats(text);

        const sticker = new Sticker(gambar, {
            pack: 'Stiker By',
            author: 'Elaina-MD',
            type: 'image/png',
        });

        const stikerBuffer = await sticker.toBuffer();
        await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m });

    } catch (err) {
        throw `Terjadi kesalahan: ${err.message}`;
    }
};

handler.help = ['cewekbrat <teks>'];
handler.command = ['cewekbrat'];
handler.tags = ['sticker']
handler.limit = false;

export default handler;