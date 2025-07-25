import axios from 'axios'
import { readdirSync, rmSync } from 'fs'
import moment from 'moment-timezone'
import fs from 'fs'
import path, { dirname } from 'path'
import crypto from "crypto"
import os from 'os'
import { komiku, otakudesu } from '../lib/scrape.js'

function imageTransaksi(status) {
    let image = {
        "Pending": "pembayaran_diproses.png",
        "Sukses": "pembayaran_berhasil.png",
        "Gagal": "pembayaran_gagal.png"
    }
    return fs.readFileSync(`./media/${image[status]}`)
}

function getCaption(status, refID, produk, harga, sn) {
    let desc = {
        "Pending": "",
        "Sukses": "_Silahkan Cek Akun Anda, Jika Belum Masuk Hubungi Owner._",
        "Gagal": "_Mohon Maaf, Saldo Anda Sudah Di-Convert Menjadi Saldo Deposit, Silahkan Ulangi Transaksi Atau Hubungi Owner._"
    }
    let caption = `
*TRANSAKSI ${status.toUpperCase()}!*

RefID : ${refID} ${sn ? `
SN : *${sn}*` : ""}
Pembelian : ${produk}
Harga : Rp ${toRupiah(harga)} ${status == "Gagal" ? `
Saldo : + Rp ${toRupiah(harga)}` : ""}
Status : ${status}
Waktu : ${formattedDate(Date.now())}

_Pembelian ${produk} ${status}!_ ${desc[status]}
`.trim()
    return caption
}

function msToTime(ms) {
    let seconds = parseInt((ms / 1000) % 60)
    let minutes = parseInt((ms / (1000 * 60)) % 60)
    let hours = parseInt((ms / (1000 * 60 * 60)) % 24)
    let days = parseInt(ms / (1000 * 60 * 60 * 24))

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

function wish() {
    let wishloc = ''
    let time = moment.tz('Asia/Jakarta').format('HH')
    wishloc = ('Hi')
    if (time >= 0) {
        wishloc = ('Selamat Malam')
    }
    if (time >= 4) {
        wishloc = ('Selamat Pagi')
    }
    if (time >= 11) {
        wishloc = ('Selamat Siang')
    }
    if (time >= 15) {
        wishloc = ('️Selamat Sore')
    }
    if (time >= 18) {
        wishloc = ('Selamat Malam')
    }
    if (time >= 23) {
        wishloc = ('Selamat Malam')
    }
    return wishloc
}

function getTime() {
    return new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

let fdoc = {
    key: {
        remoteJid: 'status@broadcast',
        participant: '0@s.whatsapp.net'
    },
    message: {
        documentMessage: {
            title: '𝙳 𝙰 𝚃 𝙰 𝙱 𝙰 𝚂 𝙴'
        }
    }
}

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

function toRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number)
}

function generateRefID() {
    return 'ry-' + Math.random().toString(36).substr(2, 9)
}

function formattedDate(ms) {
    return moment(ms).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm')
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

async function resetAll() {
    try {
        let users = global.db.data.users
        let chats = global.db.data.chats

        let dataUsers = Object.keys(users).filter(userId => users[userId].chat > 0)
        for (let userId of dataUsers) {
            if (users[userId].limit < 50) users[userId].limit = 50
            users[userId].chat = 0
            users[userId].command = 0
        }

        let dataChats = Object.keys(chats).filter(chatId => chatId.endsWith("@g.us"))
        for (let chatId of dataChats) {
            let userChat = chats[chatId].member
            let activeUsers = Object.keys(userChat).filter(userId => userChat[userId].chat > 0)
            for (let userId of activeUsers) {
                userChat[userId].chat = 0
                userChat[userId].command = 0
            }
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan reset:", error)
    }
}


async function resetCryptoPrice() {
    try {
        let invest = global.db.data.bots.invest.item
        let data = Object.keys(invest)
        for (let name of data) {
            invest[name].hargaBefore = invest[name].harga
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan reset harga crypto:", error)
    }
}


async function resetSahamPrice() {
    try {
        let saham = global.db.data.bots.saham.item
        let data = Object.keys(saham)
        for (let name of data) {
            saham[name].hargaBefore = saham[name].harga
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan reset harga saham:", error)
    }
}


async function resetVolumeSaham() {
    try {
        let bot = global.db.data.bots
        let data = Object.keys(bot.saham.item)
        for (let v of data) {
            let dataCrypto = bot.saham.item[v]
            let newChart = Date.now()
            dataCrypto.volumeBuy = 0
            dataCrypto.volumeSell = 0
            dataCrypto.open = dataCrypto.harga
            dataCrypto.high = dataCrypto.harga
            dataCrypto.low = dataCrypto.harga
            dataCrypto.chart[newChart] = [dataCrypto.harga, dataCrypto.harga, dataCrypto.harga, dataCrypto.harga]
            dataCrypto.chartNow = newChart
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan reset volume saham:", error)
    }
}


async function Backup() {
    try {
        let setting = global.db.data.settings[conn.user.jid]
        if (setting.backup) {
            let d = new Date
            let date = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            let database = fs.readFileSync('./database.json')
            for (let [jid] of global.config.owner.filter(([number, _, developer]) => number && developer)) {
                conn.reply(jid + '@s.whatsapp.net', `*🗓️ Database:* ${date}`, null)
                conn.sendMessage(jid + '@s.whatsapp.net', { document: database, mimetype: 'application/json', fileName: 'database.json' }, { quoted: fdoc })
            }
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan backup:", error)
    }
}


async function resetVolumeCrypto() {
    try {
        let bot = global.db.data.bots
        let data = Object.keys(bot.invest.item)
        for (let v of data) {
            let dataCrypto = bot.invest.item[v]
            let newChart = Date.now()
            dataCrypto.volumeBuy = 0
            dataCrypto.volumeSell = 0
            dataCrypto.open = dataCrypto.harga
            dataCrypto.high = dataCrypto.harga
            dataCrypto.low = dataCrypto.harga
            dataCrypto.chart[newChart] = [dataCrypto.harga, dataCrypto.harga, dataCrypto.harga, dataCrypto.harga]
            dataCrypto.chartNow = newChart
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat melakukan reset volume saham:", error)
    }
}

function clearMemory() {
    if (conn.spam) conn.spam = {}
    if (conn.khodam) conn.khodam = {}
}

async function OtakuNews() {
    try {
        let chat = global.db.data.chats
        let bot = global.db.data.bots
        let data = await otakudesu.ongoing()
        
        if (!Array.isArray(data)) {
            console.error("Data returned is not an array")
            return
        }
        if (data.length == 0) {
            console.error("No ongoing anime found")
            return
        }

        if (data[0].title !== bot.otakuNow) {
            bot.otakuNow = data[0].title

            let groups = Object.entries(conn.chats)
                .filter(([jid, chat]) => jid.endsWith('@g.us') 
                    && chat.isChats 
                    && !chat.metadata?.read_only 
                    && !chat.metadata?.announce 
                    && !chat.isCommunity 
                    && !chat.isCommunityAnnounce 
                    && !chat?.metadata?.isCommunity 
                    && !chat?.metadata?.isCommunityAnnounce)
                .map(v => v[0])
            
            let { status, total_eps, duration, studio, genre, synopsis } = await otakudesu.detail(data[0].link)

            for (let v of groups) {
                if (!chat[v].otakuNews) continue
                
                chat[v].otakuNow = data[0].title
                
                let caption = `
*Otakudesu Update!*

Name : ${data[0].title} ( ${data[0].episode} )
Status : ${status}
Total Episode : ${total_eps}
Durasi : ${duration}
Studio : ${studio}
Genre : ${genre}
${synopsis ? `
Sinopsis : 
${synopsis}` : ""}
                `.trim()

                await conn.sendFile(v, data[0].image, null, caption, null)
            }
        }
    } catch (error) {
        console.error("An error occurred in OtakuNews:", error.message)
    }
}


async function checkGempa() {
    try {
        let chat = global.db.data.chats
        let bot = global.db.data.bots
        let now = new Date().getTime()

        let apiResponse = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
        let gempa = apiResponse.data.Infogempa.gempa

        if (gempa.DateTime !== bot.gempaDateTime) {
            bot.gempaDateTime = gempa.DateTime

            let groups = Object.entries(conn.chats)
                .filter(([jid, chat]) => jid.endsWith('@g.us') 
                    && chat.isChats 
                    && !chat.metadata?.read_only 
                    && !chat.metadata?.announce 
                    && !chat.isCommunity 
                    && !chat.isCommunityAnnounce 
                    && !chat?.metadata?.isCommunity 
                    && !chat?.metadata?.isCommunityAnnounce)
                .map(v => v[0])

            for (let number of groups) {
                if (chat[number].notifgempa && gempa.DateTime !== chat[number].gempaDateTime) {
                    chat[number].gempaDateTime = gempa.DateTime

                    let caption = `
*BMKG Notif Gempa!*

Koordinat: ${gempa.Coordinates}
Magnitude: ${gempa.Magnitude}
Kedalaman: ${gempa.Kedalaman}

_Wilayah: ${gempa.Wilayah}, Potensi: ${gempa.Potensi}_

_Dihimbau untuk warga yang berada di wilayah *${gempa.Dirasakan}* untuk selalu berhati-hati!_
                    `.trim()

                    await conn.sendFile(number, 'https://data.bmkg.go.id/DataMKG/TEWS/' + gempa.Shakemap, 'map.jpg', caption, false)
                }
            }
        }
    } catch (error) {
        console.error("An error occurred in checkGempa:", error.message)
    }
}


async function checkSewa() {
    let chat = global.db.data.chats
    let data = Object.keys(chat).filter(v => chat[v].expired > 0 && new Date().getTime() - chat[v].expired > 0)

    for (let number of data) {
        try {
            let groupMetadata = await conn.groupMetadata(number)

            await conn.reply(number, `Waktunya *${conn.user.name}* Untuk Meninggalkan Group\nJangan lupa sewa lagi ya!`, null)
            await conn.sendContact(number, global.config.owner, null)
            await conn.groupLeave(number)

            chat[number].expired = 0
        } catch (error) {
            console.error(`Error while processing group ${number}:`, error.message)
            chat[number].expired = 0
        }
    }
}


async function checkPremium() {
    try {
        let user = global.db.data.users
        let data = Object.keys(user).filter(v => user[v].premiumTime > 0 && new Date().getTime() - user[v].premiumTime > 0)

        for (let number of data) {
            try {
                let name = user[number].registered ? user[number].name : await conn.getName(number)

                await conn.reply(number, `Halo ${name} \nWaktu premium kamu sudah habis, jika ingin perpanjang silahkan chat nomor owner dibawah ya!`, null)
                await conn.sendContact(number, global.config.owner, null)

                user[number].premiumTime = 0
                user[number].premium = false
            } catch (error) {
                console.error(`Error while processing user ${number}:`, error.message)
            }
        }
    } catch (error) {
        console.error("An error occurred in checkPremium:", error.message)
    }
}


async function updateSaham() {
    let bot = global.db.data.bots
    let persen = [0.01, 0.02]
    let invest = Object.entries(bot.saham.item)
    
    for (let [name, value] of invest) {
        const marketCapHarga = value.marketcap * value.harga

        if (marketCapHarga < 1000000000) {
            value.rise = ["naik", "turun"]
        } else if (marketCapHarga > 1000000000 && marketCapHarga <= 100000000000) {
            value.rise = ["naik", "stay", "turun"]
        } else if (marketCapHarga > 100000000000 && marketCapHarga <= 200000000000) {
            value.rise = ["naik", "stay", "stay", "turun"]
        } else if (marketCapHarga > 200000000000 && marketCapHarga <= 500000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "turun"]
        } else if (marketCapHarga > 500000000000 && marketCapHarga <= 1000000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "stay", "turun"]
        } else if (marketCapHarga > 1000000000000 && marketCapHarga <= 10000000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "stay", "stay", "turun"]
        } else if (marketCapHarga > 10000000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "stay", "stay", "stay", "turun"]
        }

        let volNaik = value.rise.filter(v => v === 'naik').length
        let volTurun = value.rise.filter(v => v === 'turun').length

        let volBuy = value.volumeBuy && value.open ? (30 / 100) * value.volumeBuy * value.open : 0
        let volSell = value.volumeSell && value.open ? (20 / 100) * value.volumeSell * value.open : 0

        if (value.volumeBuy - value.volumeSell > volBuy && volNaik === 1) {
            value.rise.push('naik')
        } else if (value.volumeSell - value.volumeBuy > volSell && volTurun === 1) {
            value.rise.push('turun')
        } else if (value.volumeBuy - value.volumeSell < volBuy && volNaik === 2) {
            value.rise = value.rise.filter(v => v !== 'naik')
        } else if (value.volumeSell - value.volumeBuy < volSell && volTurun === 2) {
            value.rise = value.rise.filter(v => v !== 'turun')
        }

        let isPersen = persen[Math.floor(Math.random() * persen.length)]
        let onePercent = Math.round(value.harga * isPersen)
        let isRise = value.rise[Math.floor(Math.random() * value.rise.length)]

        if (isRise === "naik") {
            value.harga += onePercent
        } else if (isRise === "turun" && value.harga - onePercent > 0) {
            value.harga -= onePercent
        }

        let chartNow = value.chartNow

        if (value.harga > value.high) {
            value.high = value.harga
        }

        if (value.harga < value.low || value.low === undefined) {
            value.low = value.harga
        }

        value.chart[chartNow] = [value.open, value.high, value.low, value.harga]
    }
}


function clearTmp() {
	let __dirname = global.__dirname(import.meta.url)
	let tmp = [os.tmpdir(), path.join(__dirname, '../tmp')]
	let filenames = []
	tmp.forEach(dirname => {
		try {
			fs.readdirSync(dirname).forEach(file => filenames.push(path.join(dirname, file)))
		} catch (err) {
			console.error(`Error reading directory ${dirname}:`, err)
		}
	})

	filenames.forEach(file => {
		try {
			let stats = fs.statSync(file)
			if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 5)) {
				fs.unlinkSync(file)
			}
		} catch (err) {
			console.error(`Error processing file ${file}:`, err)
		}
	})
}

async function updateCrypto() {
    let bot = global.db.data.bots
    let persen = [0.01, 0.02]
    let invest = Object.entries(bot.invest.item)
    
    for (let [name, value] of invest) {
        const marketCapHarga = value.marketcap * value.harga

        if (marketCapHarga < 1000000000) {
            value.rise = ["naik", "turun"]
        } else if (marketCapHarga > 1000000000 && marketCapHarga <= 100000000000) {
            value.rise = ["naik", "stay", "turun"]
        } else if (marketCapHarga > 100000000000 && marketCapHarga <= 200000000000) {
            value.rise = ["naik", "stay", "stay", "turun"]
        } else if (marketCapHarga > 200000000000 && marketCapHarga <= 500000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "turun"]
        } else if (marketCapHarga > 500000000000 && marketCapHarga <= 1000000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "stay", "turun"]
        } else if (marketCapHarga > 1000000000000 && marketCapHarga <= 10000000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "stay", "stay", "turun"]
        } else if (marketCapHarga > 10000000000000) {
            value.rise = ["naik", "stay", "stay", "stay", "stay", "stay", "stay", "turun"]
        }

        let volNaik = value.rise.filter(v => v === 'naik').length
        let volTurun = value.rise.filter(v => v === 'turun').length

        let volBuy = value.volumeBuy && value.open ? (30 / 100) * value.volumeBuy * value.open : 0
        let volSell = value.volumeSell && value.open ? (20 / 100) * value.volumeSell * value.open : 0

        if (value.volumeBuy - value.volumeSell > volBuy && volNaik === 1) {
            value.rise.push('naik')
        } else if (value.volumeSell - value.volumeBuy > volSell && volTurun === 1) {
            value.rise.push('turun')
        } else if (value.volumeBuy - value.volumeSell < volBuy && volNaik === 2) {
            value.rise = value.rise.filter(v => v !== 'naik')
        } else if (value.volumeSell - value.volumeBuy < volSell && volTurun === 2) {
            value.rise = value.rise.filter(v => v !== 'turun')
        }

        let isPersen = persen[Math.floor(Math.random() * persen.length)]
        let onePercent = Math.round(value.harga * isPersen)
        let isRise = value.rise[Math.floor(Math.random() * value.rise.length)]

        if (isRise === "naik") {
            value.harga += onePercent
        } else if (isRise === "turun" && value.harga - onePercent > 0) {
            value.harga -= onePercent
        }

        let chartNow = value.chartNow

        if (value.harga > value.high) {
            value.high = value.harga
        }

        if (value.harga < value.low || value.low === undefined) {
            value.low = value.harga
        }

        value.chart[chartNow] = [value.open, value.high, value.low, value.harga]
    }
}


async function checkSholat() {
    try {
        let bot = global.db.data.bots
        let chat = global.db.data.chats
        let groups = Object.entries(conn.chats)
            .filter(([jid, chat]) => jid.endsWith('@g.us') 
                && chat.isChats 
                && !chat.metadata?.read_only 
                && !chat.metadata?.announce 
                && !chat.isCommunity 
                && !chat.isCommunityAnnounce 
                && !chat?.metadata?.isCommunity 
                && !chat?.metadata?.isCommunityAnnounce)
            .map(v => v[0])
        
        let jadwalsholat = Object.keys(bot.jadwalsholat.list)

        for (let i = 0; i < jadwalsholat.length; i++) {
            let currentPrayer = jadwalsholat[i]
            let prayerTime = bot.jadwalsholat.list[currentPrayer]
            let now = getTime()

            if (prayerTime === now && bot.jadwalsholat.now !== currentPrayer) {
                bot.jadwalsholat.now = currentPrayer
                let audioUrl = currentPrayer === "Shubuh" 
                    ? "https://files.catbox.moe/dc79p5.opus" 
                    : "https://files.catbox.moe/dc79p5.opus"

                for (let chatId of groups) {
                    try {
                        if (chat[chatId].notifazan && chat[chatId]?.sholatNow !== currentPrayer) {
                            chat[chatId].sholatNow = currentPrayer

                            let thumbnail = (await conn.getFile("https://files.catbox.moe/v829ik.png")).data

                            await conn.sendFile(chatId, audioUrl, "", "", null, null, {
                                contextInfo: {
                                    externalAdReply: {
                                        showAdAttribution: false,
                                        mediaType: 1,
                                        title: `Azan ${currentPrayer} Sudah Berkumandang`,
                                        body: "Untuk wilayah Jakarta dan sekitarnya.",
                                        thumbnail: thumbnail,
                                        renderLargerThumbnail: true,
                                        mediaUrl: "",
                                        sourceUrl: ""
                                    }
                                }
                            })
                        }
                    } catch (error) {
                        console.error(`Error sending message to chat ${chatId}:`, error.message)
                    }
                }
            }
        }
    } catch (error) {
        console.error("An error occurred in checkSholat:", error.message)
    }
}


async function checkPembayaran() {
    try {
        if (!conn.pembayaran) conn.pembayaran = {}
        if (conn.pembayaranProses) return
        conn.pembayaranProses = true
        let data = Object.keys(conn.pembayaran)
        for (let key of data) {
            try {
                let user = global.db.data.users[key]
                let name = user.registered ? user.name : conn.getName(key)
                let { chat, type, refID, code, produk, harga, number, time, expired } = conn.pembayaran[key]
                let request = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${global.config.OK.ID}/${global.config.OK.Apikey}`)
                let mutasi = request.data.data
                if (!Array.isArray(mutasi)) return
                
                let transaksi = mutasi.find(v => Number(v.amount) === harga && v.date.split(" ")[0] === formattedDate(time).split(" ")[0])
                
                if (transaksi) {
                    if (/prem/i.test(code)) {
                        let hari = Number(code.replace("prem", ""))
                        let caption = await getCaption("Sukses", refID, `Premium ${hari} Hari`, harga, "")
                        let image = imageTransaksi("Sukses")
                        await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                        let jumlahHari = 86400000 * hari
                        let now = Date.now()
                        user.premiumTime = now < user.premiumTime ? user.premiumTime + jumlahHari : now + jumlahHari
                        user.premium = true
                        let timers = user.premiumTime - now
                        await conn.reply(global.config.owner[0][0] + "@s.whatsapp.net", `
✔️ Success
📛 *Name:* ${name}
📆 *Days:* ${hari} days
📉 *Countdown:* ${msToTime(timers)}
`.trim())
                        user.historyTrx.push({ status: true, trxId: refID, nominal: harga, type: `Premium ${hari} Hari`, time })
                        clearTimeout(expired)
                        delete conn.pembayaran[key]
                    } else if (/donasi|deposit/i.test(type)) {
                        let caption = `
*TRANSAKSI SUKSES!*

Nominal : Rp.${toRupiah(harga)} ( ${transaksi.brand_name} )
Type : ${capitalize(type)}
${capitalize(type)} : +Rp ${toRupiah(harga)}
${capitalize(type)} Sekarang : Rp ${toRupiah(user[type] + harga)}
Waktu Penyelesaian : ${formattedDate(Date.now())}

_Terimakasih Sudah ${type === "donasi" ? "Berdonasi" : "Mendeposit"} Ke *${conn.user.name}* Dan Terimakasih Atas Kepercayaan-Nya!_
`.trim()
                        let image = fs.readFileSync(`./media/${type}.jpg`)
                        await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                        user[type] += harga
                        user.historyTrx.push({ status: true, trxId: refID, nominal: harga, type, time })
                        clearTimeout(expired)
                        delete conn.pembayaran[key]
                    } else {
                        orderProduk(code, refID, number).then(async v => {
                            try {
                                let status = v.data.status
                                let caption = await getCaption("Pending", refID, produk, harga, v.data.sn)
                                let image = await imageTransaksi("Pending")
                                if (typeof global.db.data.bots.refID[refID] !== "undefined") return
                                global.db.data.bots.refID[refID] = true
                                if (!/Pending|Sukses|Gagal/i.test(status)) {
                                    image = await imageTransaksi(status)
                                    caption = await getCaption(status, refID, produk, harga, v.data.sn)
                                    await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                                    user.historyTrx.push({ status: false, trxId: refID, nominal: harga, type: "refund", time: Date.now() })
                                    user.deposit += harga
                                    clearTimeout(expired)
                                    delete conn.pembayaran[key]
                                    return
                                }
                                if (status == "Sukses") {
                                    image = await imageTransaksi(status)
                                    caption = await getCaption(status, refID, produk, harga, v.data.sn)
                                    await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                                    user.historyTrx.push({ status: true, trxId: refID, nominal: harga, type: produk, time: Date.now() })
                                    clearTimeout(expired)
                                    delete conn.pembayaran[key]
                                    return
                                } else if (status == "Gagal") {
                                    image = await imageTransaksi(status)
                                    caption = await getCaption(status, refID, produk, harga, v.data.sn)
                                    await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                                    user.historyTrx.push({ status: false, trxId: refID, nominal: harga, type: "refund", time: Date.now() })
                                    user.deposit += harga
                                    clearTimeout(expired)
                                    delete conn.pembayaran[key]
                                    return
                                }
                                await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                                while (status !== "Sukses" && status !== "Gagal") {
                                    if (status !== "Pending") return
                                    await delay(5000)
                                    let i = await orderProduk(code, refID, number)
                                    status = i.data.status
                                    if (status == "Sukses") {
                                        image = await imageTransaksi(status)
                                        caption = await getCaption(status, refID, produk, harga, i.data.sn)
                                        await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                                        user.historyTrx.push({ status: true, trxId: refID, nominal: harga, type: produk, time: Date.now() })
                                        clearTimeout(expired)
                                        delete conn.pembayaran[key]
                                        break
                                    } else if (status == "Gagal") {
                                        image = await imageTransaksi(status)
                                        caption = await getCaption(status, refID, produk, harga, i.data.sn)
                                        await conn.adReply(chat, caption, `Halo ${name}, ${wish()}`, global.config.watermark, image, global.config.website, null)
                                        user.historyTrx.push({ status: false, trxId: refID, nominal: harga, type: "refund", time: Date.now() })
                                        user.deposit += harga
                                        clearTimeout(expired)
                                        delete conn.pembayaran[key]
                                        break
                                    }
                                }
                            } catch (error) {
                                console.error(`Error processing order: ${error}`)
                            }
                        }).catch(error => {
                            console.error(`Error placing order: ${error}`)
                        })
                    }
                }
            } catch (error) {
                console.error(`Error processing payment for user ${key}: ${error}`)
            }
        }
    } catch (error) {
        console.error(`Error checking payments: ${error}`)
    } finally {
        delete conn.pembayaranProses
    }
}

export {
    resetAll,
    resetSahamPrice,
    resetCryptoPrice,
    Backup,
    resetVolumeSaham,
    resetVolumeCrypto,
    clearMemory,
    OtakuNews,
    checkGempa,
    updateSaham,
    checkPremium,
    checkSewa,
    clearTmp,
    updateCrypto,
    checkSholat,
    checkPembayaran
}