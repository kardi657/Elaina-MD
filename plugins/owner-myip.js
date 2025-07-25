import axios from "axios";

let handler = async (m, {
    text
}) => {

    let { data } = await axios.get(`https://api.ipify.org`)

    await m.reply(`Ip device: ${data}`)
}
handler.help = ["myip"]
handler.tags = ["owner"]
handler.command = /^(myip|ipku)$/i
handler.owner = true

export default handler