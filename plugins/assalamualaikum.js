import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const thumbnailUrl = 'https://files.catbox.moe/wad1hr.jpg';
  const thumbRes = await fetch(thumbnailUrl);
  const thumbBuffer = await thumbRes.buffer();

  const audio = {
    audio: { url: 'https://files.catbox.moe/qtqoco.opus' },
    mimetype: 'audio/mp4',
    ptt: true,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        mediaUrl: '',
        title: 'encos',
        body: 'Elaina-MD',
        sourceUrl: 'https://chat.whatsapp.com/JuzFhqS5V9VFgVGvrAm28i',
        thumbnail: thumbBuffer,
        renderLargerThumbnail: true
      }
    }
  };

  conn.sendMessage(m.chat, audio, { quoted: m });
};

handler.customPrefix =  /^(assalamualaikum|assalamu'alaikum)$/i 
handler.command = new RegExp
export default handler