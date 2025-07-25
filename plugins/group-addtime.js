/*

# Fitur : Addtime (Auto Add & Auto Kick)
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : -

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
*/

import baileys from '@adiwajshing/baileys'
const { getBinaryNodeChild, getBinaryNodeChildren } = baileys

let parseWaktu = (str) => {
  let match = str.match(/^(\d+)([dhm])$/)
  if (!match) return null
  let num = parseInt(match[1])
  let unit = match[2]
  switch (unit) {
    case 'm': return num * 60 * 1000
    case 'h': return num * 60 * 60 * 1000
    case 'd': return num * 24 * 60 * 60 * 1000
    default: return null
  }
}

let handler = async (m, { conn, text, participants }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Hanya bisa dipakai di grup')
    if (!text.includes('|')) return m.reply(`Contoh: .addtime 62xxxxx|1d`)

    let [rawNums, waktu] = text.split('|')
    let link = await conn.groupInviteCode(m.chat)
    let _participants = participants.map(u => u.id)
    let duration = parseWaktu(waktu.trim())

    if (!duration) return m.reply('❌ Format waktu hanya mendukung: 1m, 2h, 3d')

    let rawNumbers = rawNums.replace(/[\s+]/g, '').split(',')
    let users = []

    for (let num of rawNumbers) {
      num = num.replace(/\D/g, '')
      if (num.length > 4 && num.length < 20 && !_participants.includes(num + '@s.whatsapp.net')) {
        let [result] = await conn.onWhatsApp(num + '@s.whatsapp.net')
        if (result?.exists) users.push(num + '@s.whatsapp.net')
      }
    }

    if (!users.length) return m.reply('❌ Nomor tidak valid atau sudah ada di grup.')

    const response = await conn.query({
      tag: 'iq',
      attrs: { type: 'set', xmlns: 'w:g2', to: m.chat },
      content: users.map(jid => ({
        tag: 'add',
        attrs: {},
        content: [{ tag: 'participant', attrs: { jid } }]
      }))
    })

    const addNode = getBinaryNodeChild(response, 'add')
    const failed = getBinaryNodeChildren(addNode, 'participant').filter(p => p.attrs.error == 403)

    db.data.timed_members = db.data.timed_members || {}

    for (let jid of users) {
      db.data.timed_members[jid] = {
        chat: m.chat,
        expire: Date.now() + duration
      }
    }

    if (failed.length) {
      for (const user of failed) {
        const jid = user.attrs.jid
        const nomor = jid.split('@')[0]
        await m.reply(`⚠️ Gagal invite langsung @${nomor}, mengirim link...`, null, {
          mentions: [jid]
        })
        await conn.sendMessage(jid, {
          text: `👋 Kamu diundang ke grup: https://chat.whatsapp.com/${link}\n⏳ Masa aktif kamu: *${waktu.trim()}*`
        })
      }
    }

    m.reply(`✅ Berhasil invite *${users.length}* user\n⏳ Auto kick dalam *${waktu.trim()}*`)
  } catch (e) {
    m.reply(`❌ Error\nLogs error : ${e.message}`)
  }
}

setInterval(async () => {
  let now = Date.now()
  let data = db.data?.timed_members || {}
  for (let jid in data) {
    const { chat, expire } = data[jid]
    if (now >= expire) {
      try {
        await global.conn.groupParticipantsUpdate(chat, [jid], 'remove')
        await global.conn.sendMessage(chat, {
          text: `👋 @${jid.split('@')[0]} dikeluarkan karena waktu *Addtime* sudah habis`,
          mentions: [jid]
        })
      } catch (e) {
        console.log(`❌ Gagal kick ${jid}:`, e)
      } finally {
        delete db.data.timed_members[jid]
      }
    }
  }
}, 10_000)

handler.help = ['addtime <nomor>|<1d/2h/30m>']
handler.tags = ['group']
handler.command = /^addtime$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler