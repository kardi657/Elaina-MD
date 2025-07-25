//Jangan Hapus WM ZENOFFICIAL!!
//INGIN FIX FITUR? ATAU ADD FITUR?
//ZENOFFICIAL OPEN JASA FIX DAN ADD FITUR
//WA : 085879522174
//SALURAN : https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q

import FormData from 'form-data'
import axios from 'axios'
import fs from 'fs'

async function pomf2C(file) {
    if (!Array.isArray(file)) file = [file]
    file = file.filter(v => v instanceof fs.ReadStream)
    if (!file[0]) return
    const form = new FormData()
    file.forEach(function(v) {
        form.append("files[]", v)
    })
    const { data } = await axios({
            url: "https://catbox.moe/user/api.php",
            method: "POST",
            data: form,
            headers: form.getHeaders()
        }).catch(({ response }) => response)
    return data
}

export default async buffer => {
    var dta = await conn.getFile(buffer, true)
    return await pomf2C([ fs.createReadStream(dta.filename) ])
}