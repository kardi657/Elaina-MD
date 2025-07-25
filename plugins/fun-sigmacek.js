let handler  = async (m, { conn }) => {
  conn.reply(m.chat,`“${pickRandom(wibu)}”`, m)
}
handler.help = ['sigmacek']
handler.tags = ['fun']
handler.command = /^(sigmacek)$/i
export default handler 

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const wibu = [
'Sigma Level : 4%\n\nKurang Sigma Lu!',
'Sigma Level : 7%\n\nMasih Kurang Sigma',
'Sigma Level : 12%\n\nMasih Kurang Sigma Lu',
'Sigma Level : 22%\n\nHampir Sigma',
'Sigma Level : 27%\n\nSigma Dikitt😹',
'Sigma Level : 35%\n\nSigma ¼',
'Sigma Level : 41%\n\nLumayan Sigma Nih',
'Sigma Level : 48%\n\nSetengah Sigma',
'Sigma Level : 56%\n\nLu Sigma juga',
'Sigma Level : 64%\n\nLumayan Sigma',
'Sigma Level : 71%\n\nPasti Lu Punya Seribu Skibidi Toilet',
'Sigma Level : 1%\n\n99% LU GAK SIGMA!',
'Sigma Level : 77%\n\nGak akan Salah Lagi dah Sigma lu',
'Sigma Level : 83%\n\nDijamin Sepuhnya Sigma Ini Wakkk',
'Sigma Level : 89%\n\nFix Wibu Sigma Elite!',
'Sigma Level : 94%\n\nUdah Elite Sigma Sih Ini😂',
'Sigma Level : 100%\n\nGILAA SIGMA PARAH CUYYY!!!😱',
'Sigma Level : 100%\n\nGILAA SIGMA PARAH CUYYY!!!😱',
'Sigma Level : 100%\n\nGILAA SIGMA PARAH CUYYY!!!😱',
'Sigma Level : 100%\n\nGILAA SIGMA PARAH CUYYY!!!😱!!!',
]