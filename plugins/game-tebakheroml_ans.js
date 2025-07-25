//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

let handler = m => m

handler.before = async function (m, { conn }) {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml : {}
    let id = m.chat

    if (!(id in conn.tebakheroml)) return true

    let soal = conn.tebakheroml[id]
    let jawaban = soal.jawab

    if (m.text.toLowerCase() === jawaban) {
        clearTimeout(soal.timeout)
        m.reply(`🎉 *Benar!* Jawabannya adalah *${jawaban}*\n+${soal.poin} XP 🎁`)
        delete conn.tebakheroml[id]
    } else {

        soal.attempts++
        if (soal.attempts % 2 === 0) {
            m.reply('❌ Salah! Coba lagi ya.')
        }
    }

    return true
}

export default handler