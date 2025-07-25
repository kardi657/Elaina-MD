let handler = async (m, { conn, args, command }) => {
    conn.reply(m.chat, `ada apa panggil panggil aku,  kangen ya......`,m)
        }
handler.help = ['bot']
handler.tags = ['main']
handler.customPrefix = /^(bot|bt)$/i 
handler.command = new RegExp
handler.limit = false
handler.group = false
export default handler