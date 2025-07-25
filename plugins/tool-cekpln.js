import axios from 'axios';
import CryptoJS from 'crypto-js';
 
const plnOnyx = {
  api: {
    base: 'https://pln.onyxgemstone.net',
    endpoint: {
      index: '/indexplnme.php'
    }
  },
 
  headers: {
    'user-agent': 'Mozilla/5.0 (X11 Ubuntu Linux x86_64 rv:71.0) Gecko/201X0101 Firefox/71.0',
    'connection': 'Keep-Alive'
  },
 
  isValid: (id) => {
    if (!id) {
      return { valid: false, code: 400, error: "ID Pelanggannya wajib diisi anjirr 😂 lu mau ngecek apaan kalo kosong begitu..." };
    }
    if (!/^\d+$/.test(id)) {
      return { valid: false, code: 400, error: "Idih, ID Pelanggan apaan kek gini 🗿" };
    }
    if (id.length !== 12) {
      return { valid: false, code: 400, error: "ID Pelanggannya kudu 12 digit yak bree 🙃" };
    }
    return { valid: true };
  },
 
  generateHash: (appidn, id, yyy) => {
    if (!appidn || !id || !yyy) {
      return { valid: false, code: 400, error: "Parameter hash nya kurang lengkap nih bree 😂" };
    }
    try {
      const c = `${appidn}|rocks|${id}|watu|${yyy}`;
      const hash = CryptoJS.MD5(c).toString(CryptoJS.enc.Hex);
      return { valid: true, hash };
    } catch (err) {
      return { valid: false, code: 400, error: "Error 😆" };
    }
  },
 
  fmt: (amount) => {
    const num = Number(amount.replace(/\./g, ''));
    return `Rp ${num.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace(',', '.')}`;
  },
 
  parse: (data) => {
    if (typeof data === 'string') {
      try {
        const lines = data.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('{')) {
            return JSON.parse(line);
          }
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    }
    return data;
  },
 
  check: async (id) => {
    const validation = plnOnyx.isValid(id);
    if (!validation.valid) {
      return { success: false, code: validation.code, result: { error: validation.error } };
    }
 
    const timestamp = Math.floor(Date.now() / 1000);
    const appidn = 'com.tagihan.listrik';
    const yyy = timestamp.toString();
    
    const res = plnOnyx.generateHash(appidn, id, yyy);
    if (!res.valid) {
      return { success: false, code: res.code, result: { error: res.error } };
    }
 
    try {
      const response = await axios.get(`${plnOnyx.api.base}${plnOnyx.api.endpoint.index}?idp=${id}&appidn=${appidn}&yyy=${yyy}&xxx=${res.hash}`, {
        headers: {
          ...plnOnyx.headers,
          'referer': `${plnOnyx.api.base}${plnOnyx.api.endpoint.index}?idp=${id}&appidn=${appidn}&yyy=${yyy}&xxx=${res.hash}`
        }
      });
 
      const ps = plnOnyx.parse(response.data);
      if (ps.status === 'error') {
        const ros = ps.pesan || '';
        if (ros.includes('DIBLOKIR')) {
          return {
            success: false,
            code: 403,
            result: {
              error: `Eyaa, ID Pelanggan ${id} diblokir bree. Langsung telpon PLN aja yak bree..`
            }
          };
        }
 
        if (ros.includes('TAGIHAN SUDAH TERBAYAR')) {
          return {
            success: true,
            code: 200,
            result: {
              status: 'paid',
              message: `Tagihan ID Pelanggan ${id} udah dibayar bree 🤫`
            }
          };
        }
 
        if (ros.includes('id YANG ANDA MASUKKAN SALAH')) {
          return {
            success: false,
            code: 404,
            result: {
              error: `ID Pelanggan ${id} salah bree, keknya bukan nomor ID Pelanggan Listrik Pascabayar dah 🤙🏻`
            }
          };
        }
      }
 
      if (ps.status === 'success' && ps.data) {
        const data = ps.data;
        return {
          success: true,
          code: 200,
          result: {
            customer_id: data.id_pelanggan,
            customer_name: data.nama_pelanggan,
            outstanding_balance: plnOnyx.fmt(data.jumlahtagihan),
            billing_period: data.status_periode,
            meter_reading: data.standmeteran,
            power_category: data.status_tarifdaya,
            total_bills: data.status_periode.split(',').length
          }
        };
      }
 
      return {
        success: false,
        code: 404,
        result: { 
          error: "Error bree 😔" 
        }
      };
 
    } catch (err) {;
      return {
        success: false,
        code: err.response?.status || 400,
        result: { 
          error: err.message
        }
      };
    }
  }
};
 
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan ID Pelanggan PLN yang ingin dicek\nContoh: .cektagihan 123456789012');
  
  const { success, code, result } = await plnOnyx.check(text);
  
  if (!success) {
    return m.reply(`${result.error}`);
  }
 
  if (result.status === 'paid') {
    return m.reply(result.message);
  }
 
  let output = `*Informasi Tagihan PLN*\n\n`;
  output += `ID Pelanggan : ${result.customer_id}\n`;
  output += `Nama Pelanggan : ${result.customer_name}\n`;
  output += `Daya : ${result.power_category}\n`;
  output += `Periode Tagihan : ${result.billing_period}\n`;
  output += `Stand Meteran : ${result.meter_reading}\n`;
  output += `Total Tagihan : ${result.outstanding_balance}\n`;
  output += `Jumlah Tagihan : ${result.total_bills} bulan`;
 
  m.reply(output);
};
 
handler.help = ['cektagihan-pln'];
handler.command = ['cektagihan-pln'];
handler.tags = ['tools'];
 
export default handler;