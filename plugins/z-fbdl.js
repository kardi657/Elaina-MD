/*
- Name : Facebook Downloader
- Deks : Cuma Support Video
- Follow Bang : https://whatsapp.com/channel/0029Vb6D8o67YSd1UzflqU1d
- Source Scrape : https://whatsapp.com/channel/0029Vb5EZCjIiRotHCI1213L/359 ( Wolep )
*/
const fbvdl = async (fbUrl) => {
  const fixUrl = (url) => url?.replace(/\\/g,"") || null
  
  if (typeof(fbUrl) !== "string") throw Error (`mana url nya`)
  const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
  }
  
  const response = await fetch(fbUrl, {headers})
  if(!response.ok) throw Error (`${response.status} ${response.statusText} ${response.url}\n${await response.text()||null}`)
  const html = await response.text()
  
  const m_sd = html.match(/"browser_native_sd_url":"(.+?)",/)?.[1]
  const m_hd = html.match(/"browser_native_hd_url":"(.+?)",/)?.[1]
  const m_a = html.match(/"mime_type":"audio\\\/mp4","codecs":"mp4a\.40\.5","base_url":"(.+?)",/)?.[1]
  
  const result = {
    sd : fixUrl(m_sd),
    hd : fixUrl(m_hd),
    audio : fixUrl(m_a)
  }
  return result
}

let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply('Berikan Link Video Facebook\n\n*Example :* .fbdl https://www.facebook.com/share/v/15gF9f7TeA/')
    
    m.reply('Wait...')
    
    const { hd, audio } = await fbvdl(args[0])
    
    if (hd) {
      await conn.sendMessage(m.chat, { video: { url: hd } }, { quoted: m })
    }
    
    if (audio) {
      await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mp4' }, { quoted: m })
    }        
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['fbdl']
handler.command = ['fbdl', 'facebook']
handler.tags = ['downloader']

export default handler