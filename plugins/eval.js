/* Copyright (C) 2025 Pease Ernest.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Pease Ernest - rolav1
*/

const {
  Greetings,
  isAdmin,
  serialize,
  downloadMedia,
  Function,
  rolav1,
  commands,
  getBuffer,
  WriteSession,
  decodeJid,
  parseJid,
  parsedJid,
  getJson,
  isIgUrl,
  isUrl,
  getUrl,
  qrcode,
  secondsToDHMS,
  formatBytes,
  sleep,
  clockString,
  runtime,
  AddMp3Meta,
  Mp3Cutter,
  Bitly,
  isNumber,
  getRandom,
  findMusic,
  AItts,
  toAudio,
  pm2Uptime,
  XKCDComic,
  start,
} = require("../lib/");
const {
  saveMessage,
  loadMessage,
  saveChat,
  getName,
} = require("../lib/db/StoreDb");
const { yta, ytv, ytdlDl, ytdlget, formatYtdata } = require("../lib/functions");
const util = require("util");
const config = require("../config");
const { delay } = require("@whiskeysockets/baileys");
const { exec } = require('child_process');

// 💻 Execute JavaScript code
Function(
  { on: "text", fromMe: true, desc: "Run JS code (eval)", type: "misc", dontAddCommandList: true },
  async (message, match, m, client, msg) => {
    if (message.text.startsWith(">")) {
      const conn = message.client;
      const json = (x) => JSON.stringify(x, null, 2);
      const client = conn;
      try {
        let evaled = await eval(`${message.text.replace(">", "")}`);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        await message.reply("🖥️ Output: " + evaled);
      } catch (err) {
        await message.reply("❌ Error: " + util.format(err));
      }
    }
  }
);

// ⚙️ Execute asynchronous JavaScript code
Function(
  { on: "text", fromMe: true, dontAddCommandList: true },
  async (message, match, m, client, msg) => {
    if (message.text.startsWith("<")) {
      var conn = message.client;
      var client = conn;
      const util = require("util");
      const json = (x) => JSON.stringify(x, null, 2);
      try {
        let return_val = await eval(
          `(async () => { ${message.text.replace("$", "")} })()`
        );
        if (return_val && typeof return_val !== "string")
          return_val = util.inspect(return_val);
        if (return_val) await message.send("🖥️ Output: " + (return_val || "No return value"));
      } catch (e) {
        if (e) await message.send("❌ Error: " + util.format(e));
      }
    }
  }
);

// 💻 Execute shell commands
Function(
  { on: "text", fromMe: true, dontAddCommandList: true },
  async (message, match, m, client, msg) => {
    if (message.text.startsWith("$")) {
      try {
        exec(match, async (error, stdout, stderr) => {
          if (error) {
            message.reply(`❌ Error executing command: ${error.message}`);
            return;
          }
          if (stderr) {
            message.reply(`⚠️ Command stderr: ${stderr}`);
            return;
          }
          return await message.reply(`✅ Command output: ${stdout}`);
        });
      } catch (e) {
        if (e) await message.reply("❌ Error: " + util.format(e));
      }
    } else { return; }
  }
);

/**
* 📜 This bot, created by Pease Ernest, provides various commands to execute JavaScript code and shell commands.
* 💻 Commands include:
* - Executing JavaScript code using `>`.
* - Executing asynchronous JavaScript code using `<`.
* - Executing shell commands using `$`.
* ⚙️ Each command processes the provided text and returns the result with emojis for better user experience.
*/
