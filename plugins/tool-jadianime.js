/*
 
# Fitur : Foto jadi Anime
# Crated by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Scrape by : https://whatsapp.com/channel/0029Vb2mOzL1Hsq0lIEHoR0N/185
 
    ⚠️ _Note_ ⚠️
jangan hapus wm bang, hargai lahh
 
 
*/
 
import WebSocket from "ws";
import crypto from "node:crypto";
import fetch from "node-fetch";
 
const WS_URL = "wss://pixnova.ai/demo-photo2anime/queue/join";
const IMAGE_URL = "https://oss-global.pixnova.ai/";
const SESSION = crypto.randomBytes(5).toString("hex").slice(0, 9);
let wss;
let promise;
 
function _connect(log) {
    return new Promise((resolve, reject) => {
        wss = new WebSocket(WS_URL);
        wss.on("open", () => {
            console.log("[ INFO ] Koneksi ke websocket tersambung.");
            resolve();
        });
 
        wss.on("error", (error) => {
            console.error("[ ERROR ] " + error);
            reject(error);
        });
 
        wss.on("message", (chunk) => {
            const data = JSON.parse(chunk.toString());
            if (promise && promise.once) {
                promise.call(data);
                promise = null;
            } else if (promise && !promise.once) {
                if (log) console.log(data);
                if (data?.code === 200 && data?.success === true) {
                    let amba = data;
                    amba.output.result.forEach((_, i) => {
                        amba.output.result[i] = IMAGE_URL + amba.output.result[i];
                    });
                    promise.call(amba);
                    promise = null;
                }
            }
        });
    });
}
 
function _send(payload, pr) {
    return new Promise(resolve => {
        wss.send(JSON.stringify(payload));
        if (pr) {
            promise = {
                once: true,
                call: resolve
            };
        } else {
            promise = {
                once: false,
                call: resolve
            };
        }
    });
}
 
async function PixNova(data, image, log) {
    let base64Image;
    if (/https\:\/\/|http\:\/\//i.test(image)) {
        const gs = await fetch(image);
        const kb = await gs.arrayBuffer();
        base64Image = Buffer.from(kb).toString("base64");
    } else if (Buffer.isBuffer(image)) {
        base64Image = image.toString("base64");
    } else {
        base64Image = image;
    }
    await _connect(log);
    let payload = { session_hash: SESSION };
    const resp = await _send(payload, true);
    if (log) console.log(`[ ${SESSION} ] Hash: ${JSON.stringify(resp, null, 2)}`);
    
    payload = {
        "data": {
            "source_image": `data:image/jpeg;base64,${base64Image}`,
            "strength": data?.strength || 0.6,
            "prompt": data.prompt,
            "negative_prompt": data.negative,
            "request_from": 2
        }
    };
    
    return await _send(payload, false);
}
 
const handler = async (m, { conn, args }) => {
    if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith("image/")) {
        return m.reply("Balas gambar dengan perintah *photo2anime* untuk mengubahnya ke anime.");
    }
    
    const image = await m.quoted.download();
    const data = {
        prompt: "(masterpiece), best quality",
        negative: "(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres , username, blurry, trademark, watermark, title, multiple view, Reference sheet, curvy, plump, fat, strabismus, clothing cutout, side slit,worst hand, (ugly face:1.2), extra leg, extra arm, bad foot, text, name",
        strength: 0.6
    };
    
    const result = await PixNova(data, image, false);
    if (!result || !result.success) return m.reply("Gagal mengonversi gambar ke anime.");
    
    const animeImageUrl = result.output.result[0];
    await conn.sendMessage(m.chat, { image: { url: animeImageUrl }, caption: "Berhasil mengubah gambar ke anime!" }, { quoted: m });
};
 
handler.command = ["jadianime"];
handler.tags = ["ai"];
handler.help = ["jadianime <reply gambar>"];
 
export default handler;