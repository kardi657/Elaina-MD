import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `📌 *Contoh Penggunaan:*\n${usedPrefix + command} chibi anime girl white hair blue eyes`;

  try {
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});

    let response = await fetch(`https://api.ryzendesu.vip/api/ai/v2/text2img?prompt=${encodeURIComponent(text)}&model=animaginexl`);
    if (!response.ok) throw "❌ *Gagal mengambil gambar dari API!*";

    let buffer = await response.buffer();

    let caption = `✨ *AnimagineXL AI Image*  
📝 *Prompt:* ${text}  
📌 *Model:* AnimagineXL  
🌐 *Source:* RyzenDesu API`;

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: caption,
        footer: "Rika By Gisano",
        buttons: [
          {
            buttonId: `${usedPrefix + command} ${text}`,
            buttonText: { displayText: "🎨 Generate Lagi" },
            type: 1
          }
        ],
        headerType: 4
      },
      { quoted: m }
    );
  } catch (error) {
    m.reply(`❌ *Error:* ${error.message || error}`);
  }
};

handler.command = handler.help = ['animaginexl'];
handler.tags = ['ai'];
handler.limit = true;

export default handler;