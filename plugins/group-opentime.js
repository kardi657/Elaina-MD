/*

📌 Nama Fitur: Open Time Dan Close Time

🏷️ Type : Plugin ESM

🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N

🔗 inspirasi dari : https://whatsapp.com/channel/0029VaxCZ9I9cDDdrAIznL0S/3067

✍️ Convert By ZenzXD

*/

let handler = async (m, { conn, args, isBotAdmin, isAdmin }) => {

  if (!m.isGroup) return m.reply('Fitur ini hanya untuk grup');

  if (!isAdmin) return m.reply('Fitur ini hanya bisa di gunakan oleh atmin grub 🤣.');

  if (!isBotAdmin) return m.reply('kalau Bot nya ga atmin gimana mau nutup nya...🤣');

  let time = parseInt(args[0]);

  let unit = args[1];

  let action = args[2]; 

  if (!time || !unit || !action) {

    return m.reply(`*Contoh Penggunaan:*\n.opentime 10 second open\n.closetime 10 minute close\n\n*Opsi Waktu:*\nsecond\nminute\nhour\nday\n*Action:*\nopen / close`);

  }

  let timer;

  switch (unit) {

    case 'second': timer = time * 1000; break;

    case 'minute': timer = time * 60000; break;

    case 'hour': timer = time * 3600000; break;

    case 'day': timer = time * 86400000; break;

    default:

      return m.reply('*Opsi waktu tidak valid!*\nGunakan: second, minute, hour, atau day');

  }

  if (action === 'open') {

    m.reply(`⏳ Grup ini akan di buka  dalam waktu *${time} ${unit}*...`);

    setTimeout(async () => {

      await conn.groupSettingUpdate(m.chat, 'not_announcement');

      conn.sendMessage(m.chat, {

        text: '*[ OPEN TIME ]*\nCihuyyy Grub nya dah di buka ama dmin sekarang semua member bisa kirim pesan.'

      });

    }, timer);

  } else if (action === 'close') {

    m.reply(`⏳ Grup ini akan di tutup dalam time} ${unit}*...`);

    setTimeout(async () => {

      await conn.groupSettingUpdate(m.chat, 'announcement');

      conn.sendMessage(m.chat, {

        text: '*[ CLOSE TIME ]*\nGrub nya dah di tutup nih cuman atmin ama bot doang yang bisa chat, member gak bisa ya 🤣🤣🤣.'

      });

    }, timer);

  } else {

    return m.reply('*Action tidak valid!*\nGunakan: open / close');

  }

};

handler.command = ['opentime', 'closetime'];

handler.help = ['opentime <angka> <unit> <action>', 'closetime <angka> <unit> <action>'];

handler.tags = ['group'];

handler.group = true;

handler.botAdmin = true;

handler.admin = true;

export default handler;