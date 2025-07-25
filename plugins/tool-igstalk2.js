/*
Jangan Hapus Wm Bang 

*Instagram Stalker  Plugins Esm*

Stalking Account Instagram Via Username 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

Jazxcode 
*/

import axios from 'axios';
import cheerio from 'cheerio';

async function igstalkv2(query) {
  const endpoint = 'https://privatephotoviewer.com/wp-json/instagram-viewer/v1/fetch-profile';
  const payload = { find: query };
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://privatephotoviewer.com/'
  };

  const { data } = await axios.post(endpoint, payload, { headers });
  const html = data.html;
  const $ = cheerio.load(html);
  let profilePic = $('#profile-insta').find('.col-md-4 img').attr('src');
  if (profilePic && profilePic.startsWith('//')) {
    profilePic = 'https:' + profilePic;
  }
  const name = $('#profile-insta').find('.col-md-8 h4.text-muted').text().trim();
  const username = $('#profile-insta').find('.col-md-8 h5.text-muted').text().trim();
  const stats = {};
  $('#profile-insta')
    .find('.col-md-8 .d-flex.justify-content-between.my-3 > div')
    .each((i, el) => {
      const statValue = $(el).find('strong').text().trim();
      const statLabel = $(el).find('span.text-muted').text().trim().toLowerCase();
      if (statLabel.includes('posts')) {
        stats.posts = statValue;
      } else if (statLabel.includes('followers')) {
        stats.followers = statValue;
      } else if (statLabel.includes('following')) {
        stats.following = statValue;
      }
    });
  const bio = $('#profile-insta').find('.col-md-8 p').text().trim();
  return {
    name,
    username,
    profilePic,
    posts: stats.posts,
    followers: stats.followers,
    following: stats.following,
    bio
  };
}

const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('Masukkan Username Yamg Ingin Di Stalk\n\n*Example : .igstalk jokowi*');
  
  try {
    const { name, username, profilePic, posts, followers, following, bio } = await igstalkv2(args[0]);
    
    let caption = `- *Name :* ${name}\n`
    caption += `- *Username :* ${username}\n`
    caption += `- *Posts :* ${posts}\n`
    caption += `- *Followers :* ${followers}\n`
    caption += `- *Following :* ${following}\n`
    caption += `- *Bio :* ${bio}`;
    
    if (profilePic) {
      await conn.sendMessage(m.chat, { 
        image: { url: profilePic },
        caption: caption
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }
  } catch (error) {
    m.reply('Tidak Ada Akun Tersebut Atau Error');
  }
};

handler.help = ['igstalk2'];
handler.command = ['igstalk2'];
handler.tags = ['tools'];

export default handler;