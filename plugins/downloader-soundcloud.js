import fetch from 'node-fetch';
 
let handler = async (m, { conn, args }) => {
  if (!args[0]) throw '⚠️ Masukkan URL SoundCloud!\nContoh: .soundcloud https://m.soundcloud.com/tv-girl/song-about-me';
 
  let api = `https://velyn.biz.id/api/downloader/soundCloud?url=${encodeURIComponent(args[0])}`;
 
  try {
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key }});
    let res = await fetch(api);
    let json = await res.json();
 
    if (!json.status) throw '⚠️ Gagal mendapatkan data! Pastikan URL benar.';
 
    let { title, artwork, audio } = json.data;
 
    let caption = `🎵 *SoundCloud Downloader*\n\n📌 *Judul:* ${title}\n🔗 *URL:* ${args[0]}`;
 
    await conn.sendFile(m.chat, artwork, 'art.jpg', caption, m);
    await conn.sendFile(m.chat, audio, `${title}.mp3`, null, m, false, { mimetype: 'audio/mpeg' });
 
  } catch (e) {
    console.error(e);
    throw '⚠️ Terjadi kesalahan, coba lagi nanti!';
  }
};
 
handler.tags = ['downloader'];
handler.help = ['soundcloud <url>'];
handler.command = /^(soundcloud|scdl)$/i;
 
export default handler;