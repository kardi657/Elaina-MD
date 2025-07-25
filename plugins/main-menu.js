//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'

const defaultMenu = {
    before: `
*❏ I N F O  U S E R*
➣ Name : %name
➣ Tag : %tag
➣ Status : %status
➣ Limit : %limit
➣ Role : %role
➣ Level : %level [ %xp4levelup Xp For LevelUp]
➣ Xp : %exp / %maxexp
➣ Total Exp : %totalexp

*❏ T O D A Y*
➣ Time : %wib WIB
➣ Days : %week %weton
➣ Date : %date
➣ Islamic Date %dateIslamic

*❏ I N F O  B O T*
➣ Bot Name : %me
➣ Mode : Public
➣ Platform : Linux
➣ Type : Node.Js
➣ Baileys : Multi Device
➣ Uptime : %muptime
➣ Database : %rtotalreg dari %totalreg

*❏ I N F O  C O M M A N D*
🅟 = Premium
🅛 = Limit

%readmore`.trimStart(),
    header: '❏┄┅━┅┄〈 〘 *%category* 〙\n│',
    body: '┊➣ %cmd %islimit %isPremium',
    footer: '│\n┗━═┅═━━┅┄๑\n',
    after: '',
}
let handler = async (m, { conn, usedPrefix, command, __dirname, isOwner, isMods, isPrems, args }) => {
    try {
        await global.loading(m, conn)
        let tags
        let teks = `${args[0]}`.toLowerCase()
        let arrayMenu = ['all',
            'main',
            'topup',
            'ai',
            'game',
            'rpg',
            'xp',
            'sticker',
            'kerang',
            'quotes',
            'fun',
            'anime',
            'group',
            'premium',
            'nsfw',
            'internet',
            'genshin',
            'news',
            'downloader',
            'search',
            'tools',
            'primbon',
            'nulis',
            'audio',
            'maker',
            'database',
            'quran',
            'owner',
            'info',
            'sound']
        if (!arrayMenu.includes(teks)) teks = '404'
        if (teks == 'all') tags = {
            'main': 'Main',
            'topup': 'Top Up',
            'ai': 'AI',
            'game': 'Game',
            'rpg': 'RPG Games',
            'xp': 'Exp & Limit',
            'sticker': 'Sticker',
            'kerang': 'Kerang Ajaib',
            'quotes': 'Quotes',
            'fun': 'Fun',
            'anime': 'Anime & Manga',
            'group': 'Group & Admin',
            'store': 'Store',
            'premium': 'Premium',
            'nsfw': 'Nsfw',
            'internet': 'Internet',
            'genshin': 'Genshin',
            'news': 'News',
            'downloader': 'Downloader',
            'search': 'Searching',
            'tools': 'Tools',
            'primbon': 'Primbon',
            'nulis': 'MagerNulis & Logo',
            'audio': 'Audio Editing',
            'maker': 'Maker',
            'database': 'Database',
            'quran': 'Al Quran',
            'owner': 'Owner',
            'info': 'Info',
            'sound': 'Sound',
        }
        if (teks == 'main') tags = {
            'main': 'Main'
        }
        if (teks == 'topup') tags = {
            'topup': 'Top Up'
        }
        if (teks == 'ai') tags = {
            'ai': 'AI'
        }
        if (teks == 'game') tags = {
            'game': 'Game'
        }
        if (teks == 'rpg') tags = {
            'rpg': 'RPG Games'
        }
        if (teks == 'xp') tags = {
            'xp': 'Exp & Limit'
        }
        if (teks == 'sticker') tags = {
            'sticker': 'Sticker'
        }
        if (teks == 'kerang') tags = {
            'kerang': 'kerang Ajaib'
        }
        if (teks == 'quotes') tags = {
            'quotes': 'Quotes'
        }
        if (teks == 'fun') tags = {
            'fun': 'Fun'
        }
        if (teks == 'anime') tags = {
            'anime': 'Anime & Manga'
        }
        if (teks == 'group') tags = {
            'group': 'Group & Admin'
        }
        if (teks == 'store') tags = {
            'store': 'Store'
        }
        if (teks == 'premium') tags = {
            'premium': 'Premium'
        }
        if (teks == 'nsfw') tags = {
            'nsfw': 'Nsfw'
        }
        if (teks == 'internet') tags = {
            'internet': 'Internet'
        }
        if (teks == 'genshin') tags = {
            'genshin': 'Genshin'
        }
        if (teks == 'news') tags = {
            'news': 'News'
        }
        if (teks == 'downloader') tags = {
            'downloader': 'Downloader'
        }
        if (teks == 'search') tags = {
            'search': 'Searching'
        }
        if (teks == 'tools') tags = {
            'tools': 'Tools'
        }
        if (teks == 'primbon') tags = {
            'primbon': 'Primbon'
        }
        if (teks == 'nulis') tags = {
            'nulis': 'MagerNulis & Logo'
        }
        if (teks == 'audio') tags = {
            'audio': 'Audio Maker'
        }
        if (teks == 'maker') tags = {
            'maker': 'Maker'
        }
        if (teks == 'database') tags = {
            'database': 'Database'
        }
        if (teks == 'quran') tags = {
            'quran': 'Al Quran'
        }
        if (teks == 'owner') tags = {
            'owner': 'Owner'
        }
        if (teks == 'info') tags = {
            'info': 'Info'
        }
        if (teks == 'sound') tags = {
            'sound': 'Sound'
        }
        let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
        let { exp, level, role } = global.db.data.users[m.sender]
        let { min, xp, max } = xpRange(level, global.multiplier)
        let tag = `@${m.sender.split('@')[0]}`
        let user = global.db.data.users[m.sender]
        let limit = isPrems ? 'Unlimited' : toRupiah(user.limit)
        let name = user.registered ? user.name: conn.getName(m.sender)
        let status = isMods ? 'Developer': isOwner ? 'Owner': isPrems ? 'Premium User': user.level > 1000 ? 'Elite User': 'Free User'
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
        let week = d.toLocaleDateString(locale, {
            weekday: 'long'
        })
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d)
        let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })
        let _uptime = process.uptime() * 1000
        let _muptime
        if (process.send) {
            process.send('uptime')
            _muptime = await new Promise(resolve => {
                process.once('message', resolve)
                setTimeout(resolve, 1000)
            }) * 1000
        }
        let member = Object.keys(global.db.data.users).filter(v => typeof global.db.data.users[v].commandTotal != 'undefined' && v != conn.user.jid).sort((a, b) => {
            const totalA = global.db.data.users[a].command
            const totalB = global.db.data.users[b].command
            return totalB - totalA
        })
        let commandToday = 0
        for (let number of member) {
            commandToday += global.db.data.users[number].command
        }
        let totalf = Object.values(global.plugins).filter((v) => v.help && v.tags).length
        let muptime = clockString(_muptime)
        let uptime = clockString(_uptime)
        let totalreg = Object.keys(global.db.data.users).length
        let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
        let listRate = Object.values(global.db.data.bots.rating).map(v => v.rate)
        let averageRating = listRate.reduce((sum, rating) => sum + rating, 0) / listRate.length

        let listCmd = `
${wish()}, ${name}
Perkenalkan, saya adalah ${conn.user.name}. Silakan lihat daftar menu di bawah ini untuk mengetahui berbagai fitur yang dapat saya lakukan.

*INFO BOT*
➣ Name : ${conn.user.name}
➣ Database : ${opts["mongodb"] ? "MongoDB" : `Local ( ${bytesToMB(fs.readFileSync("./database.json").byteLength)} MB )`}
➣ Total Fitur : ${totalf}
➣ Command Today : ${commandToday}
➣ Rating Bot : ${averageRating.toFixed(2)}/5.00 ( ${listRate.length} Users )

‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
`.trimStart()

        let lists = arrayMenu.map((v, i) => {
            return [`${usedPrefix + command} ${v}`, (i + 1).toString(), `Menu ${capitalize(v)} \nUntuk Membuka Menu ${capitalize(v)}`]
        })
        let hwaifu = JSON.parse(fs.readFileSync('./json/hwaifu.json', 'utf-8'))
        if (teks == '404') {
            const imgg = await conn.textList(m.chat, listCmd, fs.readFileSync('./media/thumbnail.jpg'), lists, m, { mentions: [m.sender] })
            return conn.sendMessage(m.chat, {audio: {url: "https://files.catbox.moe/xro03w.mp3"}, mimetype: "audio/mpeg", ptt: false}, {quoted: imgg});
        }
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.tags) ? plugin.help: [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags: [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            }
        })
        let groups = {}
        for (let tag in tags) {
            groups[tag] = []
            for (let plugin of help)
                if (plugin.tags && plugin.tags.includes(tag))
                if (plugin.help) groups[tag].push(plugin)
        }
        conn.menu = conn.menu ? conn.menu: {}
        let before = conn.menu.before || defaultMenu.before
        let header = conn.menu.header || defaultMenu.header
        let body = conn.menu.body || defaultMenu.body
        let footer = conn.menu.footer || defaultMenu.footer
        let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '': `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
        let _text = [
            before,
            ...Object.keys(tags).map(tag => {
                return header.replace(/%category/g, tags[tag]) + '\n' + [
                    ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                        return menu.help.map(help => {
                            return body.replace(/%cmd/g, menu.prefix ? help: '%p' + help)
                            .replace(/%islimit/g, menu.limit ? '🅛': '')
                            .replace(/%isPremium/g, menu.premium ? '🅟': '')
                            .trim()
                        }).join('\n')
                    }),
                    footer
                ].join('\n')
            }),
            after
        ].join('\n')
        let text = typeof conn.menu == 'string' ? conn.menu: typeof conn.menu == 'object' ? _text: ''
        let replace = {
            '%': '%',
            p: usedPrefix,
            uptime,
            muptime,
            me: conn.getName(conn.user.jid),
            npmname: _package.name,
            npmdesc: _package.description,
            version: _package.version,
            exp: toRupiah(exp - min),
            maxexp: toRupiah(xp),
            totalexp: toRupiah(exp),
            xp4levelup: toRupiah(max - exp),
            github: _package.homepage ? _package.homepage.url || _package.homepage: '[unknown github url]',
            level: toRupiah(level),
            limit,
            name,
            weton,
            week,
            date,
            dateIslamic,
            time,
            totalreg: toRupiah(totalreg),
            rtotalreg: toRupiah(rtotalreg),
            role,
            tag,
            status,
            wib,
            readmore: readMore
        }
        text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
        await conn.sendMessage(m.chat, {video: {url: 'https://files.catbox.moe/jwl5w0.mp4'}, caption: text.trim(), gifPlayback: true, contextInfo: {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363321126686713@newsletter',
      serverMessageId: 103,
      newsletterName: '⌜ ZenOfficial Dev ⌟'
    },
                externalAdReply: {
                    showAdAttribution: true,
                    title: wish() + ' ' + name,
                    body: '',
                    mediaType: 1,
                    thumbnail: fs.readFileSync('./media/thumbnail.jpg'),
                    sourceUrl: global.config.website,
                    renderLargerThumbnail: true 
                }
              }
              })
              
       // await conn.adReply(m.chat, text.trim(), wish() + ' ' + name, '', fs.readFileSync('./media/thumbnail.jpg'), global.config.website, m)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu)$/i
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function wish() {
    let wishloc = ''
    const time = moment.tz('Asia/Jakarta').format('HH')
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

function clockString(ms) {
    let h = isNaN(ms) ? '--': Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--': Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--': Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1)
}

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".")

function bytesToMB(bytes) {
  return (bytes / 1048576).toFixed(2)
}