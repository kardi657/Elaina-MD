/*
 
# Fitur : Text to Image
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : https://velyn.vercel.app/api/ai/text2img
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
import fetch from 'node-fetch';
 
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan prompt untuk gambar.');
 
  let pesan = 
  await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});
 
  try {
    let url = `https://velyn.biz.id/api/ai/text2img?prompt=${encodeURIComponent(text)}&apikey=velyn`;
    await conn.sendFile(m.chat, url, 'image.jpg', `✅ Berhasil dibuat!\n*Prompt:* ${text}`, m);
  } catch (err) {
    console.error(err);
    m.reply('❌ Gagal membuat gambar.');
  }
};
 
handler.command = /^(text2img|imggen)$/i;
handler.help = ['text2img <prompt>'];
handler.tags = ['ai'];
 
export default handler;