/* Copyright (C) 2025 Pease Ernest.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Pease Ernest - rolav1
*/

const { rolav1, isPrivate, parsedJid } = require("../lib");
const fs = require("fs");
const path = require("path"); 
const {
    React
  } = require("../lib/db");
// Made with ❤ by AlienAlfa
const {
    translate
  } = require('@vitalets/google-translate-api');
  const defaultLang = 'en'

// 🌐 Translate text to Russian
rolav1({ on: "text", dontAddCommandList: true, fromMe: true, }, async (message, match) => {
    let jid = ["120363039040066520@g.us"];

    if (jid.includes(message.jid)) {
        let lang = "ru";
        let text = match;

        try {
            let result = await translate(text, {
                'to': lang,
                'autoCorrect': true
            });

            return await message.client.sendMessage(message.jid, { text: result.text, edit: message.key });
        } catch (error) {
            console.error(error);
            return null;
        }
    }
});

// 🔄 Handle View Once messages
rolav1(
    {
     on: "message",
     fromMe: false,
     dontAddCommandList: true
    },
    async (message, match, m) => {
        let jid = ["120363041830510029@g.us","120363277474293717@g.us"];

        if (jid.includes(message.jid)) {
            try {
              if (message.message?.message?.viewOnceMessageV2 || message.message?.message?.viewOnceMessage) {
                console.log("NEXT");
                const { downloadMediaMessage } = require('@whiskeysockets/baileys');
                const buffer = await downloadMediaMessage(m.client, 'buffer', {}, {
                    'reuploadRequest': message.client
                  });
                  return await message.sendFill("120363064171532890@g.us", buffer);
                } else return //console.log(message.message.message);
                } catch (error) {
                console.error("[Error]:", error);
            }
        }
    }
);

// ℹ️ Fetch user profile picture and status
rolav1(
    {
     on: "text",
     fromMe: false,
     dontAddCommandList: true
    },
    async (message, match, m) => {
        let jid = ["120363295384306266@g.us"];

        if (jid.includes(message.jid)) {
            try {
                const jidz = parsedJid(match);
                for(let j of jidz) {

                    let waContacts = await message.client.onWhatsApp(j);
                    let existingContact = waContacts.find(contact => contact.exists);
                    try{
                    if(existingContact.exists) {
                    let pp = await getUserProfilePicture(message, existingContact.jid)
                     try{
                        var { status, setAt } = await message.client.fetchStatus(existingContact.jid);
                     }catch(e){
                      return await message.client.sendMessage(message.jid, {image : {url: pp}, caption: "No About"});
                     }
                        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
                        var date = setAt.toLocaleDateString("en-US", options);

                        let msg = "About: "+status + "\n\nSet At: "+date+"\n\nUrl: https://wa.me/"+ await existingContact.jid.split("@")[0];
                       return await message.client.sendMessage(message.jid, {image : {url: pp}, caption: msg});

                        let data = {
                            jid: message.jid,
                            button: [
                              {
                                type: "url",
                                params: {
                                  display_text: "Message!",
                                  url: "https://wa.me/"+ await existingContact.jid.split("@")[0],
                                  merchant_url: "https://github.com/DX-MODS/",
                                },
                              }
                            ],
                            footer: {
                              text: "𝞓𝙇𝞘𝞢𝞜-𝞓𝙇𝙁𝞓",
                            },
                            header: {
                                image: {url: pp},
                                hasMediaAttachment: false,
                              },
                            body: {
                                text: await msg
                            },
                          };
                          
                          return await message.sendMessage(message.jid, data, {}, "interactive");

                    } else return await message.reply("User not found 😕");
                } catch (error) {
                    message.reply("User not found 😕");
                    return console.error("[Error]:", error);
                }
                }

                } catch (error) {
                console.error("[Error]:", error);
            }
        }
    }
);

// 🌟 Get user profile picture URL or return default image
async function getUserProfilePicture(conn, user) {
    try {
      return await conn.client.profilePictureUrl(user, "image");
    } catch {
      return "https://github.com/Alien-Alfa/Alien-alfa/blob/beta/noimg.png?raw=true";
    }
}

// 😊 React to messages with random emojis
rolav1({
    on: "message",
    fromMe: false,
    dontAddCommandList: true
},
async (message, match, m) => {
    const ReactList = await React.getReact();
    let res = ReactList.some(item => item.dataValues && item.dataValues.chatId === message.jid);

    if (res) {
        try {
            //console.log("NEXT")
            const reactionMessage = {
                react: {
                    text: await getRandomEmoji(),
                    key: message.key
                }
            }

            return await message.client.sendMessage(message.jid, reactionMessage)

        } catch (error) {
            console.error("[Error]:", error);
        }
    }
}
);

// 🎉 Get a random emoji from the list
async function getRandomEmoji() {
  const emojis = [
      "😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤩", "🥳", "😎", "😺", "😸", "😹", "😻", "😼", "👍", "🙏", "💖", "🎉", "🔥", "🌟", "💯", "🎈"
  ];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

// 📂 Get the SQLite database file
rolav1(
  {
    pattern: "getdb",
    fromMe: true,
    desc: "Get the SQLite DB",
    usage: "getdb",
    type: "tool",
  },
  async (message, match) => {
    try {
      const dbPath = path.join(global.__basedir, 'lib', 'db', 'database.db');
      const fileData = fs.readFileSync(dbPath);
      
      // Send the database file as a document
      await message.client.sendMessage(message.jid, {
        document: fileData,
        fileName: "database.db",
        mimetype: "application/x-sqlite3",
      });

    } catch (error) {
      console.error('Error sending database file:', error);
      // Optionally inform the user about the error
      await message.client.sendMessage(message.jid, {
        text: "Failed to send the database file. Please check the logs for more details.",
      });
    }
  }
);

/**
 * 📜 This bot, created by Pease Ernest, includes various functionalities:
 * - 🌐 Translating text to Russian and sending it back.
 * - 🔄 Handling View Once messages and forwarding them to a specific group.
 * - ℹ️ Fetching user profile pictures and statuses, and sending interactive messages.
 * - 😊 Reacting to messages with random emojis.
 * - 📂 Retrieving and sending the SQLite database file.
 * Each function processes the provided input and returns the appropriate result with emojis for an engaging user experience.
 */
