let handler = async (m, { conn, args, command }) => {
    conn.reply(m.chat, `pa pe pa pe,  kaya gk ada topik lain aja......`,m)
        }
handler.help = ['bot']
handler.tags = ['main']
handler.customPrefix = /^(p|pe)$/i 
handler.command = new RegExp
handler.limit = false
handler.group = false
export default handler