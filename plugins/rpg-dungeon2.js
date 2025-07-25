//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

const handler = async function (m, { conn, args }) {
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {};
  }
  const user = global.db.data.users[m.sender];

  if (!user.dungeon) {
    user.dungeon = {
      level: 1,
      progress: 0,
      boss: false,
      role: '',
      lastEnter: 0,
      cooldown: 0
    };
  }

  const roleMap = {
    wizard: '🧙 Wizard',
    warrior: '🛡️ Warrior',
    sage: '📜 Sage',
    plaguedoctor: '🧪 Plague Doctor',
    ranger: '🏹 Ranger',
    rogue: '🗡️ Rogue' // Tambahan role Rogue
  };

  // Ambil role dari parameter
  const input = args[0]?.toLowerCase();

  if (input && Object.keys(roleMap).includes(input)) {
    if (user.dungeon.role) {
      return m.reply(`Kamu sudah memilih role sebagai *${roleMap[user.dungeon.role]}*.\nGunakan *.resetrole* untuk mengganti.`);
    }
    user.dungeon.role = input;
    return m.reply(`✅ Role kamu telah dipilih: *${roleMap[input]}*`);
  }

  if (!user.dungeon.role) {
    const text = `🕳️ *Welcome to Dungeon!*\n\nPilih role kamu sebelum memulai petualangan:\n\n` +
      `wizard : .dungeon2 wizard\n` +
      `warrior : .dungeon2 warrior\n` +
      `sage : .dungeon2 sage\n` +
      `plaguedoctor : .dungeon2 plaguedoctor\n` +
      `ranger : .dungeon2 ranger\n` +
      `rogue : .dungeon2 rogue\n\n` + // Tambahkan juga di petunjuk
      `Ketik nama role seperti *wizard* untuk memilih.`;

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/wi2njs.jpg' },
      caption: text
    });

    return;
  }
};

handler.help = ['dungeon2 [role]'];
handler.tags = ['rpg'];
handler.command = /^(dungeon2)$/i;
handler.group = true;
handler.rpg = true;

export default handler;