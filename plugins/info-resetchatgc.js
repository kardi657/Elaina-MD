let resetHandler = async (m, { conn }) => {
    let user = global.db.data.chats[m.chat].member
    for (let member in user) {
        if (member != conn.user.jid) {
            user[member].chat = 0; 
            user[member].chatTotal = 0; 
        }
    }
    await conn.sendMessage(m.chat, { text: 'Semua chat telah direset.' }, { quoted: m })
}
resetHandler.help = ['resetchatgc']
resetHandler.tags = ['info']
resetHandler.command = /^(resetchatgc)$/i
resetHandler.group = true
resetHandler.admin = true
export default resetHandler