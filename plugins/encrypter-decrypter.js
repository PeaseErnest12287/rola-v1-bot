/* Copyright (C) 2025 Pease Ernest.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Pease Ernest - rolav1
*/

const { rolav1, isPrivate } = require("../lib/");
const { eBinary, dBinary, octalToText, textToOctal } = require("../lib/functions/");

// 🔒 Command to encrypt text to binary
rolav1({
       pattern: "ebinary",
       fromMe: isPrivate,
       desc: "🔒 Encrypt text to binary",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide text to encrypt! 📝");
m.reply("🔒 Encrypted text to binary: " + await eBinary(match));
});

// 🔓 Command to decrypt binary to text
rolav1({
       pattern: "dbinary",
       fromMe: isPrivate,
       desc: "🔓 Decrypt binary to text",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide binary code to decrypt! 💻");
m.reply("🔓 Decrypted binary to text: " + await dBinary(match));
});

// 🔒 Command to encrypt text to base64
rolav1({
       pattern: "ebase64",
       fromMe: isPrivate,
       desc: "🔒 Encrypt text to base64",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide text to encrypt in base64! 📝");
var encodedString = btoa(match);
m.reply("🔒 Encrypted text to base64: " + encodedString);
});

// 🔓 Command to decrypt base64 to text
rolav1({
       pattern: "dbase64",
       fromMe: isPrivate,
       desc: "🔓 Decrypt base64 to text",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide base64 code to decrypt! 💻");
var decodedString = atob(match);
m.reply("🔓 Decrypted base64 to text: " + decodedString);
});

// 🔒 Command to encrypt text to ASCII
rolav1({
       pattern: "eascii",
       fromMe: isPrivate,
       desc: "🔒 Encrypt text to ASCII",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide text to convert to ASCII! 📝");
const text = match;
const asciiValues = [];

for (let i = 0; i < text.length; i++) {
  const asciiCode = text.charCodeAt(i);
  asciiValues.push(asciiCode);
}

m.reply("🔒 Encrypted text to ASCII: " + asciiValues);
});

// 🔓 Command to decrypt ASCII to text
rolav1({
       pattern: "dascii",
       fromMe: isPrivate,
       desc: "🔓 Decrypt ASCII to text",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide ASCII code to decrypt! 💻");
const decodeascii = String.fromCharCode(match);
m.reply("🔓 Decrypted ASCII to text: " + decodeascii);
});

// 🔒 Command to encrypt text to hexadecimal
rolav1({
       pattern: "ehex",
       fromMe: isPrivate,
       desc: "🔒 Encrypt text to hexadecimal",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide text to convert to hexadecimal! 📝");
const myString = match;
const encodedHex = Buffer.from(myString).toString('hex');
m.reply("🔒 Encrypted text to hexadecimal: " + encodedHex);
});

// 🔓 Command to decrypt hexadecimal to text
rolav1({
       pattern: "dhex",
       fromMe: isPrivate,
       desc: "🔓 Decrypt hexadecimal to text",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide hexadecimal code to decrypt! 💻");
const encodedHex = match;
const decodedString = Buffer.from(encodedHex, 'hex').toString();
m.reply("🔓 Decrypted hexadecimal to text: " + decodedString);
});

// 🔒 Command to convert text to octal
rolav1({
       pattern: "eoctal",
       fromMe: isPrivate,
       desc: "🔒 Convert text to octal",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide text to convert to octal! 📝");
var inputText = match;
var octalText = textToOctal(inputText);
m.reply("🔒 Octal representation of '" + inputText + "': " + octalText);
});

// 🔓 Command to convert octal to text
rolav1({
       pattern: "doctal",
       fromMe: isPrivate,
       desc: "🔓 Convert octal to text",
       type: "encrypter",
}, 
async (m, match) => {
match = match || m.reply_message.text;
if (!match) return await m.reply("⚠️ Please provide octal code to decrypt! 💻");
var inputOctal = match;
var textResult = octalToText(inputOctal);
m.reply("🔓 Converted text: " + textResult);
});

/**
 * 📜 This bot, created by Pease Ernest, provides various encryption and decryption commands.
 * 🔒 Commands include:
 * - Encrypting and decrypting text to/from binary, base64, ASCII, hexadecimal, and octal.
 * - Commands are restricted to private messages.
 * 🛠️ Each command processes the provided text and returns the converted result.
 */
