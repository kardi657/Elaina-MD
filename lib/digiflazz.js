import axios from "axios"
import crypto from "crypto"
import fs from "fs"

let digiUser = global.config.digi.username
let digiApi = global.config.digi.apikey

async function orderProduk(code, refId, tujuan) {
    const signature = crypto.createHash("md5").update(digiUser + digiApi + refId).digest("hex")
    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: digiUser,
            buyer_sku_code: code,
            customer_no: tujuan,
            ref_id: refId,
            sign: signature,
        })
    }
    let request = await fetch("https://api.digiflazz.com/v1/transaction", config)
    let json = await request.json()
    return json
}

async function addProduk() {
    const requestBody = {
        cmd: "prepaid",
        username: digiUser,
        sign: crypto
        .createHash("md5")
        .update(digiUser + digiApi + "pricelist")
        .digest("hex"),
    }

    try {
        const response = await axios.post("https://api.digiflazz.com/v1/price-list", requestBody)
        const data = response.data.data

        data.forEach((product) => {
            product.price = countProfit(product.price)
        })

        fs.writeFileSync("./json/digi.json", JSON.stringify(data, null, 2))
        console.log("Berhasil menambahkan produk")
    } catch (e) {
        console.error(e)
    }
}

function getProduk(code) {
    const jsonData = fs.readFileSync("./json/digi.json", "utf-8");
    const data = JSON.parse(jsonData)
    const filteredData = data.filter((product) => product.buyer_sku_code === code)
    return filteredData.length > 0 ? filteredData[0] : null
}

function listHarga(brand = "all") {
    const jsonData = fs.readFileSync("./json/digi.json", "utf-8");
    const data = JSON.parse(jsonData)
    const filteredData = data.filter((product) => product.brand === brand)
    return brand == "all" ? data : filteredData
}

function countProfit(jumlahAwal) {
    jumlahAwal = parseInt(jumlahAwal)
    let keuntungan = jumlahAwal * global.config.taxRate
    if (keuntungan > global.config.taxMax) keuntungan = global.config.taxMax
    return (jumlahAwal + keuntungan).toFixed(0)
}

export {
    addProduk,
    getProduk,
    listHarga,
    orderProduk
}