const { proto, generateWAMessage, areJidsSameUser } = (await import('@adiwajshing/baileys')).default

export async function before(m, chatUpdate) {
    try {
        const user = global.db.data.users[m.sender]
        const isMods = [conn.decodeJid(global.conn.user.id), ...global.config.owner.filter(([number, _, isDeveloper]) => number && isDeveloper).map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = m.fromMe || isMods || [conn.decodeJid(global.conn.user.id), ...global.config.owner.filter(([number, _, isDeveloper]) => number && !isDeveloper).map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems =  isOwner || new Date() - user.premiumTime < 0

        if (m.isBaileys || m.fromMe || !m.message || !isPrems || !m.msg.fileSha256) return

        global.db.data.users[m.sender].sticker = global.db.data.users[m.sender].sticker || {}

        const fileHash = Buffer.from(m.msg.fileSha256).toString('base64')
        const userStickerData = global.db.data.users[m.sender].sticker

        if (!(fileHash in userStickerData)) return

        let hash = userStickerData[fileHash]
        let { text, mentionedJid } = hash

        let messages = await generateWAMessage(m.chat, { text, mentions: mentionedJid }, {
            userJid: this.user.id,
            quoted: m.quoted && m.quoted.fakeObj
        })

        messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
        messages.key.id = m.key.id
        messages.pushName = m.pushName

        if (m.isGroup) messages.participant = m.sender

        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }

        this.ev.emit('messages.upsert', msg)
    } catch (error) {
        console.error('Error processing message:', error)
    }
}
