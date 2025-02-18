/* Copyright (C) 2025 Pease Ernest.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Pease Ernest - rolav1
*/

const { rolav1, isPrivate } = require("../lib/");
const { listall } = require("../lib/functions");

// ✨ Convert text to fancy text
rolav1(
  {
    pattern: "fancy",
    fromMe: isPrivate,
    desc: "✨ Converts text to fancy text",
    type: "converter",
  },
  async (message, match) => {
    let text = match;
    let replyMessageText = message.reply_message && message.reply_message.text;

    if (replyMessageText) {
      if (!isNaN(match)) {
        // Convert replied message text to fancy text with specific style
        return await message.reply(styleText(replyMessageText, match));
      }
      
      // Convert replied message text to all fancy styles
      let fancyTexts = listAllFancyTexts(replyMessageText);
      return await message.reply(fancyTexts);
    }

    if (!text) {
      // Default text to demonstrate fancy styles
      let fancyTexts = listAllFancyTexts("Fancy");
      return await message.reply(fancyTexts);
    }

    if (!isNaN(match)) {
      if (match > listAllFancyTexts("Fancy").length) {
        return await message.sendMessage("❌ Invalid number");
      }
      // Convert input text to fancy text with specific style
      return await message.reply(styleText(text, match));
    }

    // Convert input text to all fancy styles
    let fancyTexts = listAllFancyTexts(match);
    return await message.reply(fancyTexts);
  }
);

// 📜 List all fancy text styles
function listAllFancyTexts(text) {
  let message = "✨ Fancy text generator\n\nReply to a message\nExample: .fancy 32\n\n";
  listall(text).forEach((txt, index) => {
    message += `${index + 1} ${txt}\n`;
  });
  return message;
}

// 🎨 Style text with specific fancy style
function styleText(text, index) {
  index = index - 1;
  return listall(text)[index];
}
