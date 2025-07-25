let handler = async (m, { conn, args }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]
  
  if (!(who in global.db.data.users)) return m.reply(`User ${who} tidak ditemukan di database`)

  // Hitung Rank Level
  let sortedlevel = Object.entries(global.db.data.users).sort((a, b) => b[1].level - a[1].level)
  let userslevel = sortedlevel.map(v => v[0])
  let levelRank = userslevel.indexOf(who) + 1

  // Hitung Rank Money
  let sortedmoney = Object.entries(global.db.data.users).sort((a, b) => b[1].money - a[1].money)
  let usersmoney = sortedmoney.map(v => v[0])
  let moneyRank = usersmoney.indexOf(who) + 1

  // Hitung Rank Bank
  let sortedbank = Object.entries(global.db.data.users).sort((a, b) => b[1].bank - a[1].bank)
  let usersbank = sortedbank.map(v => v[0])
  let bankRank = usersbank.indexOf(who) + 1

  // Role
  let roleText = getUserRoleText(user)

  // Build Profile Text
  let profileText = `
👤 *PROFILE RPG*

🧑🏻‍🏫 Nama: *${user.registered ? user.name : conn.getName(who)}*
🆔 User: *${who.split('@')[0]}*
❤️ Heal: *${toRupiah(user.health ?? 0)}* ❤️

🗡️ Role: ${roleText}

🎚️ Level: *${user.level || 0}*
⭐ Exp: *${toRupiah(user.exp || 0)}*

💰 Money: *${toRupiah(user.money || 0)}*
🏦 Bank: *${toRupiah(user.bank || 0)}*

🎖️ Rank (Leaderboard):
${global.rpg.emoticon('level')} Level: Rank *${toRupiah(levelRank)}* dari *${toRupiah(userslevel.length)}*
${global.rpg.emoticon('money')} Money: Rank *${toRupiah(moneyRank)}* dari *${toRupiah(usersmoney.length)}*
${global.rpg.emoticon('bank')} Bank: Rank *${toRupiah(bankRank)}* dari *${toRupiah(usersbank.length)}*

📌 Gunakan command lain untuk melihat inventory atau tools.
`.trim()

  // Kirim pakai gambar avatar
  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/yrqnfv.jpg' }, // ganti URL ini kalau mau avatar RPG lain
    caption: profileText
  }, { quoted: m })
}

handler.help = ['profilgng']
handler.tags = ['rpg']
handler.command = /^profilgng$/i

handler.register = true
handler.group = true
handler.rpg = true

export default handler

// Helper function getUserRoleText
function getUserRoleText(user) {
  if (!user?.dungeon?.role) return '❌ Belum memilih'
  const roleEmoticon = global.rpg.emoticon(user.dungeon.role) || ''
  const roleName = user.dungeon.role.charAt(0).toUpperCase() + user.dungeon.role.slice(1)
  return `${roleEmoticon} ${roleName}`
}

// Helper function toRupiah
const toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".")