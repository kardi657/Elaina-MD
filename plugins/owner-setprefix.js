let handler = async (m, {
    conn,
    text
}) => {
    if (!text) throw `No Prefix detected...`
    if (text == 'null') {
        opts["noprefix"] = true
    } else if (text == 'multi') {
        opts['noprefix'] = false
    } else {
        global.prefix = new RegExp('^[' + (text || global.opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
        opts["noprefix"] = false
    }
    await m.reply(`Prefix telah ditukar ke *${text}*`)
}
handler.help = ['setprefix'].map(v => v + ' [prefix]')
handler.tags = ['owner']
handler.command = /^(setprefix)$/i

handler.rowner = true

export default handler