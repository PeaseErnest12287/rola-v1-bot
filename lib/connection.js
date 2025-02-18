/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

require('dotenv').config();
console.log("Session Id:", process.env.SESSION_ID);

const pino = require("pino");
const path = require("path");
const fs = require("fs");
const plugins = require("./events");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  delay,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const { PausedChats } = require("./db");
const config = require("../config");
const { serialize, Greetings } = require("./index");
const { Image, Message, Sticker, Video, AllMessage } = require("./base");
const { getcall } = require("./db/callAction");
const {
  loadMessage,
  saveMessage,
  saveChat,
  getName,
} = require("./db/StoreDb");

const logger = pino({ level: "silent" });

const connect = async () => {
  const Aurora = async () => {
    require("dotenv").config(); // Load environment variables
    
    const sessionDir = "./session";
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);
    
    const sessionCredentials = process.env.SESSION_CREDENTIALS
      ? JSON.parse(process.env.SESSION_CREDENTIALS)
      : null;
    
    const { state, saveCreds } = sessionCredentials
      ? { state: sessionCredentials, saveCreds: async () => {} } // Load session from .env
      : await useMultiFileAuthState(path.join(__dirname, "session")); // Default session handling
    
    const { version } = await fetchLatestBaileysVersion();
    const conn = makeWASocket({
      auth: state,
      logger,
      browser: Browsers.macOS("Desktop"),
      printQRInTerminal: false, // ❌ QR will never be printed
    });
    
    conn.ev.on("creds.update", async (newCreds) => {
      process.env.SESSION_CREDENTIALS = JSON.stringify(newCreds);
      fs.writeFileSync(".env", `SESSION_ID=${JSON.stringify(newCreds)}\n`);
      await saveCreds();
    });
    
    conn.ev.on("connection.update", handleConnectionUpdate(conn));
    conn.ev.on("group-participants.update", async (data) => Greetings(data, conn));
    conn.ev.on("chats.update", async (chats) =>
      chats.forEach(async (chat) => await saveChat(chat))
    );
    conn.ev.on("messages.upsert", handleMessages(conn));
    
    process.on("uncaughtException", async (err) => {
      console.log(err);
    });
    
    return conn;
  };
  
  const handleConnectionUpdate = (conn) => async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "connecting") console.log("Connecting to WhatsApp... Please Wait.");
    else if (connection === "open") {
      console.log("✅ Login Successful!");
      const totalPlugins = plugins.commands.length;
      const workType = config.WORK_TYPE;
      const packageVersion = require("../package.json").version;
      const num = conn.user.id.split(":")[0];
      
      const str = `\`\`\`----- Rola v1 -----\n\nVersion: ${packageVersion}\nNumber: ${num}\nTotal Plugins: ${totalPlugins}\nWorktype: ${workType}\n\n----- Rola v1 -----\`\`\``;
      return conn.sendMessage(conn.user.id, { text: str });
    } else if (connection === "close") {
      if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        const statusCode = lastDisconnect.error?.output?.statusCode;
        await delay(300);
        console.log("Disconnection Reason: " + (DisconnectReason[statusCode] || statusCode));
        console.log("Reconnecting...");
        return Aurora();
      } else {
        console.log("Connection closed. Device logged out.");
        await delay(1000);
        return process.send("shutdown");
      }
    }
  };
  
  const handleMessages = (conn) => async (m) => {
    if (m.type !== "notify") return;
    let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
    await saveMessage(m.messages[0], msg.sender);
    if (config.AUTO_READ) await conn.readMessages(msg.key);
    if (config.AUTO_STATUS_READ && msg.from === "status@broadcast")
      await conn.readMessages(msg.key);
    
    plugins.commands.map(async (command) => {
      if (command.fromMe && !msg.sudo) return;
      const handleCommand = (Instance, args) => {
        const whats = new Instance(conn, msg);
        command.function(whats, ...args, msg, conn, m);
      };
      
      if (msg.body && command.pattern) {
        let isCommand = msg.body.match(command.pattern);
        if (isCommand) {
          let [, prefix, , match] = isCommand;
          msg.prefix = prefix;
          msg.command = [prefix, isCommand[2]].join("");
          handleCommand(Message, [match]);
        }
      }
    });
  };
  
  try {
    return Aurora();
  } catch (error) {
    console.error("Aurora function error:", error);
  }
};

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Exiting...");
  process.exit(0);
});

module.exports = connect;
