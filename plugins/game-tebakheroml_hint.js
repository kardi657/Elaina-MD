//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

let handler = async (m, { conn }) => {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml : {}
    let id = m.chat

    if (!(id in conn.tebakheroml)) {
        return m.reply('Tidak ada soal yang aktif di chat ini. Ketik *.tebakheroml* untuk memulai!')
    }

    let jawab = conn.tebakheroml[id].jawab
    let hint = jawab.replace(/[aeiou]/g, '_') // hilangkan huruf vokal → jadi hint

    m.reply(`💡 Hint: ${hint}`)
}

handler.help = ['herohint']
handler.tags = ['game']
handler.command = /^herohint$/i

handler.limit = true
handler.game = true

export default handler