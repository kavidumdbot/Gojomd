const { fetchJson } = require('../lib/functions')
const cheerio = require('cheerio')
const { igdl } = require('ruhend-scraper')
const axios = require('axios');
const { cmd, commands } = require('../lib/command')

cmd({
    pattern: "twitter",
    alias: ["tweet", "twdl"],
    react: "🪧",
    desc: "Download Twitter videos",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: mek });
    }

    // React to indicate processing start
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    // Fetch video information from Dark Yasiya Twitter API
    const twitterData = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = twitterData.data;

    if (!data || !data.status || !data.result) {
      return m.reply("Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;
    const captionHeader = `
┏━┫ *⚬Gojo-ᴍᴅ-ᴛᴡɪᴛᴇʀ⚬* ┣━✾
┃            *Gojo  ✻  Md*
┻
*🔢 ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ*

*ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ 🎬*

*1.1*     ┃  *ꜱᴅ Qᴜᴀʟɪᴛʏ*
*1.2*     ┃  *ʜᴅ Qᴜᴀʟɪᴛʏ*

*ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅ 🎧*

*2.1*     ┃  *ᴀᴜᴅɪᴏ*
*2.2*     ┃  *ᴅᴏᴄᴜᴍᴇɴᴛ*
*2.3*     ┃  *ᴠᴏɪᴄᴇ*

> Gojo-ᴍᴅ ✻
`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
      caption: captionHeader,
      contextInfo: {
        mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
        groupMentions: [],
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {

            newsletterName: "Gojo-ᴍᴅ ✻",
            serverMessageId: 999
        }     
    }
}, {quoted: mek});
    const messageID = sentMsg.key.id;

    // Listen for the user's response
    conn.ev.on('messages.upsert', async (messageUpdate) => {
      const mek = messageUpdate.messages[0];
      if (!mek.message) return;
      const messageType = mek.message.conversation || mek.message.extendedTextMessage?.text;
      const from = mek.key.remoteJid;

      // Check if the message is a reply to the previously sent message
      const isReplyToSentMsg = mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo.stanzaId === messageID;

      if (isReplyToSentMsg) {
        // React to the user's selection
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

        if (messageType === '1.1') {
          // Send SD video
          await conn.sendMessage(from, {
            video: { url: video_sd}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
            caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱayura mihiranga · · ·*"}, { quoted: mek });
        } else if (messageType === '1.2') {
          // Send HD video
          await conn.sendMessage(from, {
            video: { url: video_hd}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
            caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ sayura mihiranga  · · ·*"}, { quoted: mek });
        } else if (messageType === '2.1') {
          // Send audio as an audio file
          await conn.sendMessage(from, { audio: { url: video_sd }, mimetype: "audio/mpeg" }, { quoted: mek });
        } else if (messageType === '2.2') {
          // Send audio as a document file
          await conn.sendMessage(from, {
            document: { url: video_sd },
            mimetype: "audio/mpeg",
            fileName: `Gojo-md/TWDL.mp3`,
            caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ sayura mihiranga · · ·*",
            contextInfo: {
                mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
                groupMentions: [],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {

                    newsletterName: "Gojo-ᴍᴅ ✻",
                    serverMessageId: 999
                }           
            }
     }, {quoted: mek});
        } else if (messageType === '2.3') {
          // Send audio as a voice note (ptt)
          await conn.sendMessage(from, { audio: { url: video_sd }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
        }
    }
    });
  } catch (e) {
    console.log(e);
    reply(`An error occurred: ${e}`);
  }
});




cmd({
    pattern: "mediafire",
    alias: "mfire",
    desc: "To download MediaFire files.",
    react: "♻️",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        if (!q) return m.reply("Please provide a valid MediaFire link.");

        // React to indicate download start
        m.react('⬇️');

        // Fetch file information from the Dark Yasiya API
        const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
        const resData = response.data;

        if (!resData || !resData.status || !resData.result || !resData.result.dl_link) {
            return m.reply("Failed to fetch MediaFire download link. Ensure the link is valid and public.");
        }

        const fileUrl = resData.result.dl_link;
        const fileName = resData.result.fileName || "mediafire_download";
        const fileType = resData.result.fileType || "application/octet-stream";

        // React to indicate file is being sent
        m.react('⬆️');

        let msg = `
┏━┫ *⚬GOJO MD-ᴍꜰɪʀᴇ⚬* ┣━✾
┃            *Gojo  ✻  Md*
┻
*ꜰɪʟᴇ ɴᴀᴍᴇ :* ${fileName}

*ꜰɪʟᴇ ᴛʏᴘᴇ :* ${fileType}

> Gojo-ᴍᴅ ✻
        `

        // Send file to chat without downloading
        await conn.sendMessage(from, {
          document: { url: fileUrl},
          mimetype: fileType,
          fileName: fileName, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
          caption: msg,
          contextInfo: {
            mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
            groupMentions: [],
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {

                newsletterName: "Gojo-ᴍᴅ ✻",
                serverMessageId: 999
            }            
        }
 }, {quoted: mek});

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }
});


cmd({

  pattern: "ig",
  alias: "instragam",
  desc: "To download instagram videos.",
  react: "📷",
  category: "download",
  filename: __filename

},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{

if (!q) return m.reply(`Please Give Me a vaild Link...`);
m.react('⬇️')

       let res = await igdl(q);

       let data = await res.data;
       for (let i = 0; i < 20; i++) {
          let media = data[i];
          let downloadurl = media.url
           m.react('⬆️')
          await conn.sendMessage(from,{
            video: {url:downloadurl},
            mimetype:"video/mp4",
            caption: `*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ sayura  mihiranga· · ·*`,
            contextInfo: {
                mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
                groupMentions: [],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {

                    newsletterName: "Gojo-ᴍᴅ ✻",
                    serverMessageId: 999
                }           
            }
     }, {quoted: mek});
           m.react('✅')
       }

}catch(e){
console.log(e)
}
})



async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]};
      resolve({status: true, result: {title, URL, duration, image, videoType, videoWidth, videoHeight, info, files}});
    }).catch((err) => reject({status: false, result: err}));
  });
}

cmd({
    pattern: "xnxxdown",
    alias: ["dlxnxx","xnxxdl"],
    react: '🫣',
    desc: "Download xnxx videos",
    category: "nsfw",
    use: '.xnxx <xnxx link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
 //if (!isMe) return await reply('🚩 You are not a premium user\nbuy via message to owner!!')
 if (!q) return reply('*Please give me url !!*')
  let res = await xdl(q)
  let title = res.result.title
  await conn.sendMessage(from, { 
    video: { url: res.result.files.high },
     caption: title,
     contextInfo: {
        mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
        groupMentions: [],
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {

            newsletterName: "Gojo-ᴍᴅ ✻",
            serverMessageId: 999
        }     
    }
}, {quoted: mek});
} catch (e) {
reply('*Error !!*')
console.log(e)
}
})

cmd({
  pattern: "xxx",
  alias: ["dlxv","xmv"],
  react: '🫣',
  desc: "Download xvideos videos",
  category: "nsfw",
  use: '.xv <xvideos link>',
  filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{      
//if (!isMe) return await reply('🚩 You are not a premium user\nbuy via message to owner!!')
if (!q) return reply('*Please give me url !!*')


let xv_info = await fetchJson(`https://www.dark-yasiya-api.site/download/xvideo?url=${q}`)
const msg = `
   🔞 *XVIDEO DOWNLOADER* 🔞

     
• *Title* - ${xv_info.result.title}

• *Views* - ${xv_info.result.views}

• *Like* - ${xv_info.result.like}

• *Deslike* - ${xv_info.result.deslike}

• *Size* - ${xv_info.result.size}`



await conn.sendMessage(from, {
  video: { url: xv_info.result.dl_link}, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
  caption: msg,
  contextInfo: {
    mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {

        newsletterName: "Gojo-ᴍᴅ ✻",
        serverMessageId: 999
    }    
}
}, {quoted: mek});

} catch (e) {
reply('*Error !!*')
console.log(e)
}
})

//APK

cmd({
    pattern: "apk2",
    react: "☯️",
    desc: "Download apk.",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
try {

await m.react("⬇")

const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
const response = await axios.get(apiUrl);
const data = response.data;

let step1 = data.datalist.list[0].size % 1000000
let step2 = `.` + step1
let step3 = data.datalist.list[0].size / 1000000
let correctsize = step3 - step2

let desc = `
┏━┫ *⚬GOJO-ᴍᴅ-ᴀᴘᴋ⚬* ┣━✾
┃            *gojo  ✻  md*
┻
*🏷️ Nᴀᴍᴇ :* ${data.datalist.list[0].name}

*📦 Sɪᴢᴇ :* ${correctsize}MB

*🔖 Pᴀᴄᴋᴀɢᴇ :* ${data.datalist.list[0].package}

*📆 Lᴀꜱᴛ Uᴘᴅᴀᴛᴇ :* ${data.datalist.list[0].updated}

*👤 Dᴇᴠᴇʟᴏᴘᴇʀꜱ :* ${data.datalist.list[0].developer.name}

> Gojo-ᴍᴅ ✻
`
await m.react("⬆")
await conn.sendMessage(from,{
    document: {url: data.datalist.list[0].file.path_alt},
    fileName: data.datalist.list[0].name,
    mimetype: 'application/vnd.android.package-archive',
    caption: desc,
    contextInfo: {
        mentionedJid: ['94743826406@s.whatsapp.net'], // specify mentioned JID(s) if any
        groupMentions: [],
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {

            newsletterName: "Gojo-ᴍᴅ ✻",
            serverMessageId: 999
        }       
    }
    }, {quoted: mek});


await m.react("✅")

}catch(e){
console.log(e)
reply(`${e}`)
}
})




const fetch = require('node-fetch')
const { sizeFormatter } = require('human-readable')

const formatSize = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

async function GDriveDl(url) {
  let id, result = { error: true }

  if (!url || !url.match(/drive\.google/i)) return result

  try {
    // Extract file ID from Google Drive link
    id = (url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/) || [])[1]
    if (!id) throw new Error('ID Not Found')

    // Initial request to get direct download info
    const res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
      method: 'POST',
      headers: {
        'accept-encoding': 'gzip, deflate, br',
        'content-length': 0,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'origin': 'https://drive.google.com',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
        'x-drive-first-party': 'DriveWebUi',
        'x-json-requested': 'true'
      }
    })

    const jsonText = await res.text()
    const json = JSON.parse(jsonText.slice(4))

    if (!json.downloadUrl) throw new Error('Link blocked or quota exceeded.')

    const dlRes = await fetch(json.downloadUrl)
    if (dlRes.status !== 200) throw new Error(`Download failed: ${dlRes.statusText}`)

    const mimetype = dlRes.headers.get('content-type') || 'video/mp4'

    return {
      error: false,
      downloadUrl: json.downloadUrl,
      fileName: json.fileName || 'Unknown',
      fileSize: formatSize(json.sizeBytes || 0),
      mimetype
    }

  } catch (e) {
    console.error('[GDriveDl Error]', e.message)
    return result
  }
}

cmd({
  pattern: 'gdrive2',
  desc: 'Download MP4 video from Google Drive and send to WhatsApp',
  category: 'downloader',
  use: '.gdrive <google drive link>',
  filename: __filename
}, async (conn, m, msg, { q, from }) => {
  if (!q || !q.includes('drive.google.com')) {
    return m.reply('❌ *Please provide a valid Google Drive link.*')
  }

  m.reply('📥 Downloading from Google Drive...')

  const data = await GDriveDl(q)

  if (data.error) {
    return m.reply('❌ *Failed to get direct link (maybe quota exceeded or link is blocked).*')
  }

  // ❗ Allow only .mp4 videos
  if (!data.mimetype.includes('video/mp4')) {
    return m.reply(`❌ *Only MP4 video files are allowed.*\n\n📄 Detected Type: ${data.mimetype}`)
  }

  try {
    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: 'video/mp4',
      fileName: data.fileName,
      caption: `✅ *Downloaded from Google Drive:*\n\n📁 *Name:* ${data.fileName}\n📦 *Size:* ${data.fileSize}`
    }, { quoted: m })
  } catch (err) {
    console.error('[SendVideo Error]', err)
    m.reply('⚠️ *Error while sending the video file.*')
  }
})

