/**
 * ✧ CekOngkir - Tool ✧ ───────────────────────
 * • Type   : Plugin ESM
 * • Source : https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05
 * • C by   : SXZnightmare
 * • API    : https://zenzxz.dpdns.org
 */

let handler = async (m, { conn, text }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    if (!text) return m.reply('*📌 Format salah!*\n*Contoh:* .cekongkir [kota asal]|[kota tujuan]|[berat(kg)]\n*Contoh:* .cekongkir surabaya|jakarta|1.5');

    const [asal, tujuan, berat] = text.split('|').map(v => v.trim());
    if (!asal || !tujuan || !berat) return m.reply('*❌ Format tidak lengkap!*\n*Contoh:* .cekongkir surabaya|jakarta|1.5');

    const apiUrl = `https://zenzxz.dpdns.org/tools/cekongkir?asal=${encodeURIComponent(asal)}&tujuan=${encodeURIComponent(tujuan)}&berat=${encodeURIComponent(berat)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`*🚩 Gagal memproses (Status: ${response.status})*`);
    
    const data = await response.json();
    if (!data?.success || !data?.result) throw new Error('*❌ Tidak mendapatkan data ongkir*');

    const route = data.result.route;
    const couriers = data.result.couriers;

    let resultText = `*🚚 HASIL CEK ONGKIR*\n\n` +
                    `*📍 Rute Pengiriman:*\n` +
                    `• *📨Dari:* ${route.dari}\n` +
                    `• *📩Menuju:* ${route.menuju}\n` +
                    `• *🪨Berat:* ${route.berat}\n\n` +
                    `*📦 Pilihan Kurir:*\n\n`;

    couriers.forEach(courier => {
      resultText += `*🏢${courier.name.toUpperCase()}*\n`;
      courier.services.forEach(service => {
        resultText += `├ *🏪Layanan:* ${service.service}\n` +
                      `├ *💰Harga:* ${service.price}\n` +
                      `├ *⏱️Estimasi:* ${service.estimate || '-'}\n` +
                      `╰ *📝Deskripsi:* ${service.desc}\n\n`;
      });
    });

    resultText += `*📢 Note:* Harga dapat berubah tergantung kebijakan kurir`;

    await conn.sendMessage(m.chat, {
      text: resultText,
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`*❌ Gagal:* ${e.message}`);
  } finally {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
  }
};

handler.help = ['cekongkir'];
handler.command = /^(cek(ongkir)?|ongkir)$/i;
handler.tags = ['tool'];
handler.limit = true;
handler.register = false;

export default handler;