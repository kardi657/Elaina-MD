import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, command, args }) => {
    let bot = global.db.data.bots
    let user = global.db.data.users[m.sender]
    let name = user.registered ? user.name : conn.getName(m.sender)
    let emot = v => global.rpg.emoticon(v)

    let invest = Object.entries(bot.invest.item).sort((a, b) => {
        let totalA = a[1].marketcap * a[1].harga
        let totalB = b[1].marketcap * b[1].harga
        return totalB - totalA
    })

    let cap = `
*Market Bot ${conn.user.name}*

${invest.map((v, i) => {
    let hargaSebelumnya = v[1].hargaBefore
    let hargaSekarang = v[1].harga

    let keuntungan = ((hargaSekarang - hargaSebelumnya) / hargaSebelumnya) * 100
    let update = v[1].harga - hargaSebelumnya
    return `
*${i + 1}.* ${emot(v[0])} ${v[1].name}
Harga: ${toRupiah(v[1].harga)}
Update: ${update > 0 ? `+${toRupiah(update)}` : toRupiah(update)} (${keuntungan.toFixed(2)}%)
Market Cap: ${toRupiah(v[1].marketcap * v[1].harga)}
`.trim()
}).join("\n\n")}

Contoh Penggunaan:
> Untuk Membeli Crypto
> ${usedPrefix}crypto-buy bitcoin 100
> Untuk Menjual Saham
> ${usedPrefix}crypto-sell bitcoin 100
`.trim()

    let commands = command.split("-")[1]
    let coinName = (args[0] || '').toLowerCase()
    if (!coinName || !commands) {
        return conn.adReply(m.chat, cap, `Halo ${name}, ${wish()}`, global.config.watermark, "https://files.catbox.moe/sdyjz7.jpg", global.config.website, m)
    }

    let coin = Object.entries(bot.invest.item).find(v => v[1].name.toLowerCase() === coinName)
    if (!coin) {
        return m.reply(`Nama koin tidak ditemukan!\n*List koin:* \n\n${invest.map(v => `*•* ${v[1].name}`).join("\n")}`)
    }

    user.invest[coinName] = user.invest[coinName] || { harga: 0, stock: 0 }
    let total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1)

    switch (commands) {
        case 'buy': {
            let price = coin[1].harga * total
            if (price > user.bank) return m.reply("Saldo bank kamu kurang untuk membeli koin ini")
            if (total > 5000000) return m.reply("Maksimal 5.000.000 untuk sekali pembelian")

            let average = await calculateAverage(user.invest[coinName].harga, user.invest[coinName].stock, coin[1].harga, total)
            user.bank -= price
            user.invest[coinName].stock += total
            user.invest[coinName].harga = average

            bot.invest.item[coinName].marketcap += total
            bot.invest.item[coinName].volumeBuy += total
            bot.invest.item[coinName].trade.push({
                user: m.sender,
                total: total,
                type: "buy"
            })

            m.reply(`Berhasil membeli ${toRupiah(total)} ${capitalize(coinName)} ${emot(coinName)} seharga ${toRupiah(price)} Bank ${emot('bank')}`)
            break
        }
        case 'sell': {
            if (user.invest[coinName].stock < total) return m.reply(`Kamu hanya memiliki ${toRupiah(user.invest[coinName].stock)} ${capitalize(coinName)} ${emot(coinName)}`)
            let price = coin[1].harga * total
            if (total > 5000000) return m.reply("Maksimal 5.000.000 untuk sekali penjualan")
            if (user.fullatm < user.bank + price) return m.reply(`Kapasitas Bank kamu telah penuh, silakan upgrade terlebih dahulu!`)

            let average = await calculateAverage(user.invest[coinName].harga, user.invest[coinName].stock, coin[1].harga, total)
            user.bank += price
            user.invest[coinName].stock -= total
            user.invest[coinName].harga = average

            bot.invest.item[coinName].marketcap -= total
            bot.invest.item[coinName].volumeSell += total
            bot.invest.item[coinName].trade.push({
                user: m.sender,
                total: total,
                type: "sell"
            })

            m.reply(`Berhasil menjual ${toRupiah(total)} ${capitalize(coinName)} ${emot(coinName)} seharga ${toRupiah(price)} Bank ${emot('bank')}`)
            break
        }
        case 'history': {
            let footer = `${bot.invest.item[coinName].name} Trade History\n\n`
            let cap = bot.invest.item[coinName].trade.reverse().slice(0, 19).map(v => {
                return `> (${conn.getName(v.user).slice(0, 5)}..) ${v.type === "buy" ? "_Membeli_" : "_Menjual_"} *${toRupiah(v.total)}* ${emot(coinName)} ${bot.invest.item[coinName].name}`
            }).join("\n")
            m.reply(footer + cap)
            break
        }
        case 'candle':
        case 'chart': {
            let caption = `
Harga 1 Jam Terakhir :
Open : ${toRupiah(bot.invest.item[coinName].open)}
Highest : ${toRupiah(bot.invest.item[coinName].high)}
Lowest : ${toRupiah(bot.invest.item[coinName].low)}
Close : ${toRupiah(bot.invest.item[coinName].harga)}
`.trim()
            let chart = await chartImage(Object.values(bot.invest.item[coinName].chart).slice(-100))
            await conn.sendFile(m.chat, chart, null, caption, m)
            break
        }
        default:
            return m.reply('Perintah tidak dikenali!')
    }
}

handler.help = ["crypto"]
handler.tags = ["rpg"]
handler.command = /^((invest(asi)?|crypto)(-buy|-sell|-history|-chart|-candle)?)$/i
handler.rpg = true
handler.group = true
export default handler

async function calculateAverage(hargaNew, stockNew, harga, stock) {
    let totalBiaya = (harga * stock) + (hargaNew * stockNew)
    let totalStock = stock + stockNew
    return totalBiaya / totalStock
}

function isNumber(value) {
    return !isNaN(parseInt(value))
}

let toRupiah = number => parseInt(number).toLocaleString('id-ID')

function wish() {
    let time = moment.tz('Asia/Jakarta').format('HH')
    if (time >= 0 && time < 4) return 'Selamat Malam'
    if (time >= 4 && time < 11) return 'Selamat Pagi'
    if (time >= 11 && time < 15) return 'Selamat Siang'
    if (time >= 15 && time < 18) return 'Selamat Sore'
    return 'Selamat Malam'
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}