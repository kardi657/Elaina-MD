import axios from 'axios';
import fs from 'fs';
import path from 'path';
const {fromBuffer} = await import('file-type');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const handler = async (m, {conn, text }) => {
    if (!text) return m.reply(`⚡ *AISCRAPE INSTRUCTION*\n\nUse: .scrape <url> | <optional instruction>\nExample:\n.scrape https://example.com | Extract titles and links`);
// ini di baca yak
    const [urlPart, ...instructionPart] = text.split('|');
    const url = urlPart.trim();
    const userInstruction = instructionPart.join('|').trim();

    if (!/^https?:\/\//.test(url)) return m.reply(`Invalid URL. Must start with http:// or https://`);

    const vertex = new VertexAI();

    let statusMsg = await conn.sendMessage(m.chat, {
        text: `Fetching data from: ${url}`
    }, {
        quoted: m
    }); await delay(1000)

    try {
        const response = await axios.get(url, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const buffer = Buffer.from(html, 'utf-8');

        await conn.sendMessage(m.chat, {
            text: `Uploading data file to AI...`,
            edit: statusMsg.key
        });
await delay(2000)
        const base64 = buffer.toString('base64');

        const prompt = `
You are an expert Node.js scraper developer.  
A user provided the HTML of a web page (attached as a TXT file).  

✅ Your task:  
- Write a complete Node.js scraper using axios and cheerio.  
- The scraper must fetch the live version of the URL (do not parse the file directly).  
- Extract *only meaningful and visible data* that exists in the page, such as:  
  * The actual page title (meta title, h1)  
  * Meta description (if present)  
  * All valid links (href + text) that are not empty or just #  
  * All valid images (src + alt)  
  * Paragraph texts (if meaningful content exists)  
  * List items (ul/ol)  
  * Table data (if present)  

✅ Requirements:  
- The script must output extracted data as clean, valid JSON.  
- Add basic error handling for axios and cheerio operations.  
- Output only the Node.js code (no explanation, no markdown).  
- Include a comment showing how to run it (example: node your_script.js).  
- If no meaningful data found, return empty JSON object {}.  

⚠ RULE: If unable to generate the code, return ONLY: { "success": false, "message": "reason" }. No extra text.
${userInstruction ? `\n✅ Additional user instruction: ${userInstruction}` : ''}
`;
// boleh kalian sesuaikan agar lebih maksimal
        await conn.sendMessage(m.chat, {
            text: `AI generating code...`,
            edit: statusMsg.key
        });

        const result = await vertex.chat('', {
            model: 'gemini-2.5-pro',
            file_buffer: buffer,
            system_instruction: prompt
        });

        if (!result || !result[0] || !result[0].content) throw new Error('No response from AI');
        const aiText = result[0].content.parts.map(p => p.text).join('').trim();

        const cleanCode = aiText.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

        await conn.sendMessage(m.chat, {
            text: cleanCode.slice(0, 4000)
        }, {
            quoted: m
        });

    } catch (err) {
        console.error('AISCRAPE ERROR:', err);
        await conn.sendMessage(m.chat, {
            text: `Failed: ${err.message}`,
            edit: statusMsg.key
        });
    }
};

class VertexAI {
    constructor() {
        this.api_url = 'https://firebasevertexai.googleapis.com/v1beta';
        this.model_url = 'projects/gemmy-ai-bdc03/locations/us-central1/publishers/google/models';
        this.headers = {
            'content-type': 'application/json',
            'x-goog-api-client': 'gl-kotlin/2.1.0-ai fire/16.5.0',
            'x-goog-api-key': 'AIzaSyD6QwvrvnjU7j-R6fkOghfIVKwtvc7SmLk'
        };
    }
// ini dari rynn, kalau mati coba aja ubah x-goog-api-key atau yang lainnya
    async chat(question, {
        model = 'gemini-2.5-pro',
        system_instruction = null,
        file_buffer = null
    } = {}) {
        const parts = [];
        if (file_buffer) {
            parts.push({
                inlineData: {
                    mimeType: 'text/plain',
                    data: file_buffer.toString('base64')
                }
            });
        }
        if (question) parts.push({
            text: question
        });

        const r = await axios.post(`${this.api_url}/${this.model_url}/${model}:generateContent`, {
            model: `${this.model_url}/${model}`,
            contents: [
                ...(system_instruction ? [{
                    role: 'model',
                    parts: [{
                        text: system_instruction
                    }]
                }] : []),
                {
                    role: 'user',
                    parts: parts
                }
            ]
        }, {
            headers: this.headers
        });

        if (r.status !== 200) throw new Error('No result from AI');
        return r.data.candidates;
    }
}

handler.command = ['scrape'];
handler.category = 'tools';
handler.description = 'Scrape site code using VertexAI.';
handler.owner = true;
export default handler;