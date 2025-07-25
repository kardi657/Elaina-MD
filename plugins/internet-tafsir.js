/*
- Fitur: Tafsir & Arti surah - ayat Alqur'an 
- Info: Semoga Jadi Anak Yang Sholeh ya
- Type: Plugins `ESM`
- By: SkyWalker
- [ `Sumber` ]
- https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u
*/

import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!(args[0] || args[1])) throw `Contoh:\n${usedPrefix + command} 1 2\n\nMaka hasilnya adalah surah Al-Fatihah ayat 2`
    if (isNaN(args[0]) || isNaN(args[1])) throw `Contoh:\n${usedPrefix + command} 1 2\n\nMaka hasilnya adalah surah Al-Fatihah ayat 2`
    
    let res = await alquran(args[0], args[1])
    
    m.reply(`
${res.arab}
${res.latin}

${res.terjemahan}
${readMore}
${res.tafsir}

( ${res.surah} )
`.trim())
}

handler.help = ['alquran <114> <1>']
handler.tags = ['internet']
handler.command = /^(al)?quran$/i

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

async function alquran(surah, ayat) {
    let res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`)
    if (!res.ok) throw 'Error, mungkin tidak ditemukan?'
    
    let $ = cheerio.load(await res.text())
    let content = $('body > main > div > div.content.clearfix > div.news > section > div.list-content.clearfix')
    
    let Surah = $(content).find('div.ayat-title > h1').text()
    let arab = $(content).find('div.ayat-detail > div.ayat-arab').text()
    let latin = $(content).find('div.ayat-detail > div.ayat-latin').text()
    let terjemahan = $(content).find('div.ayat-detail > div.ayat-detail-text').text()
    let tafsir = ''
    
    $(content).find('div.ayat-detail > div.tafsir-box > div').each(function () {
        tafsir += $(this).text() + '\n'
    })
    tafsir = tafsir.trim()

    let keterangan = $(content).find('div.ayat-detail > div.ayat-summary').text()
    
    return {
        surah: Surah,
        arab,
        latin,
        terjemahan,
        tafsir,
        keterangan,
    }
}