const gclinkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/gi
const walinkRegex = /wa.me\/([0-9])/gi
const linkRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys || m.fromMe) return 
    let chat = global.db.data.chats[m.chat]
    let setting = global.db.data.settings[conn.user.jid]

    let isGroupLink = gclinkRegex.exec(m.text)
    let isLinkWa = walinkRegex.exec(m.text)
    let isLink = linkRegex.exec(m.text)

    if (chat.antiLinkGc && m.isGroup) {
        if (isGroupLink && !isAdmin) {
            if (isBotAdmin) {
                const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat) ? await this.groupInviteCode(m.chat) : '123'}`
                if (m.text.includes(linkThisGroup)) return !0
            }
            if (chat.teks) {
                if (setting.composing)
                    await this.sendPresenceUpdate('composing', m.chat)
                if (setting.autoread)
                    await this.readMessages([m.key])

                await m.reply(`_*乂 Link Group Terdeteksi!*_ ${chat.pembatasan ? '\n_pesan kamu akan di hapus!_': '\n_pesan kamu akan dihapus dan kamu akan dikick!_'} ${isBotAdmin ? '': '\n\n_❬Bot Bukan Admin❭_'}`)
            }
            if (isBotAdmin && !chat.pembatasan) {
                await conn.sendMessage(m.chat, { delete: m.key })
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            } else if (chat.pembatasan && isBotAdmin) {
                await conn.sendMessage(m.chat, { delete: m.key })
            }
        }
    }
    
    if (chat.antiLinkGc2 && m.isGroup) {
        if (isGroupLink && !isAdmin) {
            if (isBotAdmin) {
                const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat) ? await this.groupInviteCode(m.chat) : '123'}`
                if (m.text.includes(linkThisGroup)) return !0
            }
            if (chat.teks) {
                if (setting.composing)
                    await this.sendPresenceUpdate('composing', m.chat)
                if (setting.autoread)
                    await this.readMessages([m.key])

                await m.reply(`_*乂 Link Group Terdeteksi!*_ ${chat.pembatasan ? '\n_pesan kamu akan di hapus!_': '\n_pesan kamu akan dihapus dan Jika Melanggar Lagi Akan Di Kick!_'} ${isBotAdmin ? '': '\n\n_❬Bot Bukan Admin❭_'}`)
            }
            if (isBotAdmin && !chat.pembatasan) {
                await conn.sendMessage(m.chat, { delete: m.key })
            } else if (chat.pembatasan && isBotAdmin) {
                await conn.sendMessage(m.chat, { delete: m.key })
            }
        }
    }

    if (chat.antiLinkWa && m.isGroup) {
        if (isLinkWa && !isAdmin) {
            if (chat.teks) {
                if (setting.composing)
                    await this.sendPresenceUpdate('composing', m.chat)
                if (setting.autoread)
                    await this.readMessages([m.key])

                await m.reply(`_*乂 Link Whatsapp Terdeteksi!*_ ${chat.pembatasan ? '\n_pesan kamu akan di hapus!_': '\n_pesan kamu akan dihapus dan kamu akan dikick!_'} ${isBotAdmin ? '': '\n\n_❬Bot Bukan Admin❭_'}`)
            }
            if (isBotAdmin && !chat.pembatasan) {
                await conn.sendMessage(m.chat, { delete: m.key })
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            } else if (chat.pembatasan && isBotAdmin) {
                await conn.sendMessage(m.chat, { delete: m.key })
            }
        }
    }

    if (chat.antiLinks && m.isGroup) {
        if (isLink && !isAdmin) {
            if (chat.teks) {
                if (setting.composing)
                    await this.sendPresenceUpdate('composing', m.chat)
                if (setting.autoread)
                    await this.readMessages([m.key])

                await m.reply(`_*乂 Link Terdeteksi!*_ ${chat.pembatasan ? '\n_pesan kamu akan di hapus!_': '\n_pesan kamu akan dihapus dan kamu akan dikick!_'} ${isBotAdmin ? '': '\n\n_❬Bot Bukan Admin❭_'}`)
            }
            if (isBotAdmin && !chat.pembatasan) {
                await conn.sendMessage(m.chat, { delete: m.key })
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            } else if (chat.pembatasan && isBotAdmin) {
                await conn.sendMessage(m.chat, { delete: m.key })
            }
        }
    }

}