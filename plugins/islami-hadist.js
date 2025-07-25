import https from 'https'

let handler = async (m, { usedPrefix, command, args }) => {
    let ht = url => new Promise((resolve, reject) => {
        https.get(url, res => {
            res.setEncoding('utf8')
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data))
                } catch (e) {
                    reject('Gagal mengambil data. Coba lagi nanti.')
                }
            })
        }).on('error', () => reject('Terjadi kesalahan saat mengambil data.'))
    })

    let pilihan = await ht('https://allhadist.vercel.app/hadith')
    if (!args[0]) {
        let pilihanText = pilihan.map(p => `${p.name}\n1 - ${p.total}`).join('\n\n')
        throw `Contoh:\n${usedPrefix + command} Bukhari 1\n\nPilihan tersedia:\n${pilihanText}`
    }

    let hadistSlug = pilihan.find(p => p.name.toLowerCase() === args[0].trim().toLowerCase())?.slug
    if (!hadistSlug) throw `Nama hadist tidak valid. Pilihan tersedia:\n${pilihan.map(p => p.name).join(', ')}`

    if (!args[1] || isNaN(args[1])) throw `Hadist yang ke berapa?\nContoh: ${usedPrefix + command} ${args[0]} 1`

    let hadist = await ht(`https://allhadist.vercel.app/hadith/${hadistSlug}/${args[1]}`)
    if (!hadist || !hadist.arab) throw 'Hadist tidak ditemukan.'

    let { name, number, arab, id } = hadist
    let info = `*\`HADIST:\`* ${name}\n*\`NOMOR:\`* ${number}\n\n*${arab}*\n\n*Artinya: ${id}*`
    
    await conn.reply(m.chat, info, m, { 
    mentionedJid: [m.sender], 
    contextInfo: { 
        isForwarded: true, 
        forwardingScore: 999, 
        forwardedNewsletterMessageInfo: { 
            newsletterJid: '120363291918888155@newsletter', 
            newsletterName: `Hai kak ${await conn.getName(m.sender)}`, 
            serverMessageId: -1 
        }
    }
}), await conn.newsletterFollow("120363291918888155@newsletter")

}

handler.help = ['hadist']
handler.tags = ['islam']
handler.command = /^(hadist?)$/i

export default handler