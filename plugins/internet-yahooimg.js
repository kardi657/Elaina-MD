import fetch from 'node-fetch';
 
/*
 
# Fitur : Yahoo Image Search
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : https://velyn.vercel.app/api/search/yahooimg
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan kata kunci pencarian!');
 
    let res = await fetch(`https://velyn.biz.id/api/search/yahooimg?q=${encodeURIComponent(text)}&apikey=velyn`);
    let json = await res.json();
 
    if (!json.status || !json.data || json.data.length === 0) {
        return m.reply('Gambar tidak ditemukan.');
    }
 
    let img = json.data[0]; // Ambil gambar pertama
    let caption = `🔍 *Hasil Pencarian Yahoo Image* \n\n📌 *Judul*: ${img.title}\n📏 *Ukuran*: ${img.size}\n📷 *Resolusi*: ${img.width}x${img.height}`;
 
    conn.sendMessage(m.chat, { image: { url: img.url }, caption }, { quoted: m });
};
 
handler.tags = ['internet'];
handler.help = ['yahooimg <query>'];
handler.command = /^(yahooimg)$/i;
 
export default handler;