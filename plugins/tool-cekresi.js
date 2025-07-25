/*
- Name : Cek Resi
- Deks :  Buat Cek Status Paket
- Follow Bang : https://whatsapp.com/channel/0029Vb6D8o67YSd1UzflqU1d
- Source Scrape : https://whatsapp.com/channel/0029VbANq6v0VycMue9vPs3u/218
*/
import axios from 'axios'
import cheerio from 'cheerio'
import CryptoJS from 'crypto-js'

function createTimers(resi) {
  try {
    let key = CryptoJS.enc.Hex.parse('79540e250fdb16afac03e19c46dbdeb3')
    let iv = CryptoJS.enc.Hex.parse('eb2bb9425e81ffa942522e4414e95bd0')
    return CryptoJS.AES.encrypt(resi, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString()
  } catch (e) {
    return null
  }
}

async function cekresi(noresi, ekspedisi) {
  let _ekspedisi = {
    'shopee-express': 'SPX', 'ninja': 'NINJA', 'lion-parcel': 'LIONPARCEL', 'pos-indonesia': 'POS', 'tiki': 'TIKI',
    'acommerce': 'ACOMMERCE', 'gtl-goto-logistics': 'GTL', 'paxel': 'PAXEL', 'sap-express': 'SAP', 'indah-logistik-cargo': 'INDAH',
    'lazada-express-lex': 'LEX', 'lazada-logistics': 'LEL', 'janio-asia': 'JANIO', 'jet-express': 'JETEXPRESS', 'pcp-express': 'PCP',
    'pt-ncs': 'NCS', 'nss-express': 'NSS', 'grab-express': 'GRAB', 'rcl-red-carpet-logistics': 'RCL', 'qrim-express': 'QRIM',
    'ark-xpress': 'ARK', 'standard-express-lwe': 'LWE', 'luar-negeri-bea-cukai': 'BEACUKAI',
    'Anteraja': 'anteraja'
  }

  if (!noresi) throw new Error('Nomor resi diperlukan')
  if (!Object.keys(_ekspedisi).includes(ekspedisi)) throw new Error(`Ekspedisi tersedia: ${Object.keys(_ekspedisi).join(', ')}`)

  let { data: html } = await axios.get('https://cekresi.com/')
  let $ = cheerio.load(html)
  let timers = createTimers(noresi.toUpperCase().replace(/\s/g, ''))
  let form = new URLSearchParams()
  form.append('viewstate', $('input[name="viewstate"]').attr('value'))
  form.append('secret_key', $('input[name="secret_key"]').attr('value'))
  form.append('e', _ekspedisi[ekspedisi])
  form.append('noresi', noresi.toUpperCase().replace(/\s/g, ''))
  form.append('timers', timers)

  let { data } = await axios.post(`https://apa2.cekresi.com/cekresi/resi/initialize.php?ui=e0ad7e971ce77822056ba7a155f85c11&p=1&w=${Math.random().toString(36).substring(7)}`, form.toString(), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      referer: 'https://cekresi.com/',
      origin: 'https://cekresi.com',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  })

  let $$ = cheerio.load(data)
  let res = {
    ekspedisi: $$('#nama_expedisi').text().trim(),
    status: '',
    tanggalKirim: '',
    lastPosition: $$('#last_position').text().trim(),
    customerService: ($$('h5 center').text().includes('Customer Service Phone:')) ? $$('h5 center').text().replace('Customer Service Phone:', '').trim() : '',
    shareLink: $$('#linkcekresi').attr('value'),
    history: []
  }

  $$('.table-striped tbody tr').each((i, el) => {
    let td = $$(el).find('td')
    if (td.length >= 3) {
      let label = $$(td[0]).text().trim()
      let value = $$(td[2]).text().trim()
      if (label == 'Tanggal Pengiriman') res.tanggalKirim = value
      if (label == 'Status') res.status = value
    }
  })

  $$('h4:contains("History")').next('table').find('tbody tr').each((i, el) => {
    let td = $$(el).find('td')
    if (td.length >= 2 && i > 0) res.history.push({
      tanggal: $$(td[0]).text().trim(),
      keterangan: $$(td[1]).text().trim()
    })
  })

  return res
}

let handler = async (m, { conn, args }) => {
  try {
    let noresi = args[0]
    let ekspedisi = args[1]
    let r = await cekresi(noresi, ekspedisi)
    let text = `Resi : ${noresi}
Ekspedisi : ${r.ekspedisi}
Status : ${r.status}
Tanggal Kirim : ${r.tanggalKirim}
Last Position : ${r.lastPosition}
Customer Service : ${r.customerService}
Link : ${r.shareLink}

History :
${r.history.map((v, i) => `${i + 1}. Tanggal : ${v.tanggal}
   Keterangan : ${v.keterangan}`).join('\n')}`

    await m.reply(text)
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['cekresi']
handler.command = ['cekresi']
handler.tags = ['tools']

export default handler