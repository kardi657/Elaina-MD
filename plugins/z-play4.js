const ali = {
    search: async (query) => {
        const q = query.replace(/[^0-9A-Za-z _]/g,"").trim().replace(/ +/g,"-")
        const r = await fetch(`https://hybridfallrye.ca/discover/${q}/`, { method: "POST" })
        if (!r.ok) throw Error(`Search failed: ${r.status}`)
        const json = await r.json()
        if (!json.length) throw Error(`No results for "${query}"`)
        return json
    },

    download: async (id) => {
        if (typeof id !== "string" || !id) throw Error("Invalid video ID")
        
        const delay = ms => new Promise(res => setTimeout(res, ms))
        const r1 = await fetch(`https://c01-h01.cdnframe.com/api/v4/info/${id}`)
        if (!r1.ok) throw Error(`Info fetch failed: ${r1.status}`)

        const { videoId, title, thumbnail, formats } = await r1.json()
        const token = formats?.audio?.mp3?.[0]?.token
        if (!token) throw Error("No token available")

        const r2 = await fetch("https://c01-h01.cdnframe.com/api/v4/convert", {
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token }),
            method: "POST"
        })
        if (!r2.ok) throw Error(`Convert failed: ${r2.status}`)
        
        const { jobId } = await r2.json()
        if (!jobId) throw Error("No job ID received")

        let job = {}
        let attempts = 0
        const MAX_ATTEMPTS = 20
        
        while (job.progress !== 100) {
            const r3 = await fetch(`https://c01-h01.cdnframe.com/api/v4/status/${jobId}`)
            if (!r3.ok) throw Error(`Status check failed: ${r3.status}`)
            
            job = await r3.json()
            if (job.progress === 0) attempts++
            if (attempts >= MAX_ATTEMPTS) throw Error("Conversion timeout")
            if (job.progress !== 100) await delay(3000)
        }

        return job.download
    }
}

let handler = async (m, { conn, args }) => {
    try {
        if (!args[0]) return m.reply("*Example :* .play Only We Know Speed Up");
        
        const [{ id }] = await ali.search(args.join(' '))
        const audioUrl = await ali.download(id)
        
        await conn.sendMessage(m.chat, { 
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg' 
        }, { quoted: m })
    } catch (e) {
        m.reply(e.message)
    }
}

handler.help = ['play']
handler.command = ['play4']
handler.tags = ['downloader']

export default handler