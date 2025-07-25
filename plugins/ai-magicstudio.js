/*
 
# Fitur : magicStudio
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : https://velyn.biz.id/api/ai/magicStudio
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
import fetch from 'node-fetch';
 
let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Masukkan prompt untuk gambar!');
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});
 
    let prompt = encodeURIComponent(args.join(' '));
    let apiUrl = `https://velyn.biz.id/api/ai/magicStudio?prompt=${prompt}&apikey=velyn`;
 
    try {
        let res = await fetch(apiUrl);
        let contentType = res.headers.get('content-type');
 
        console.log('Content-Type:', contentType); 
 
        if (contentType && contentType.startsWith('image')) {
            let buffer = await res.buffer();
            await conn.sendFile(m.chat, buffer, 'magicStudio.jpg', 'Nih gambarnya 😹', m);
        } else {
            m.reply('Gagal mendapatkan gambar, API mungkin sedang error.');
        }
    } catch (e) {
        console.error('Fetch Error:', e);
        m.reply('Terjadi kesalahan saat menghubungi API.');
    }
};
 
handler.tags = ['ai'];
handler.help = ['magicstudio <prompt>'];
handler.command = /^magicstudio$/i;
 
export default handler;