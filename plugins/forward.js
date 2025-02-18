/* Copyright (C) 2025 Pease Ernest.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Pease Ernest - rolav1
*/

const { rolav1, parsedJid } = require("../lib/");

// ✉️ Forward the replied message to specified JIDs
rolav1(
  {
    pattern: "fwd",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "Util",
  },
  async (message, match, m) => {
    if (!m.quoted) return message.reply('⚠️ Reply to something! ⚠️');
    
    let jids;
    if (match.includes("@g.us")) {
      // Extract group JIDs from the match
      jids = match.split(' ').filter(word => word.includes("@g.us"));
    } else {
      // Parse individual JIDs from the match
      jids = parsedJid(match);
    }

    if (match.includes("ptt")) {
      if (message.reply_message.audio) {
        // Forward audio messages with PTT option enabled
        for (let i of jids) {
          try {
            const relayOptions = { ptt: true, messageId: m.quoted.key.id };
            await message.client.relayMessage(i, m.quoted.message, relayOptions);
          } catch (error) {
            console.error("[Error]:", error);
          }
        }
      } else {
        return message.reply('❌ This is not an audio message');
      }
    } else {
      // Forward other types of messages
      for (let i of jids) {
        try {
          const relayOptions = { messageId: m.quoted.key.id };
          await message.client.relayMessage(i, m.quoted.message, relayOptions);
        } catch (error) {
          console.error("[Error]:", error);
        }
      }
    }
  }
);

/**
 * 📜 This bot, created by Pease Ernest, provides a functionality to forward replied messages:
 * - ✉️ Forwards the replied message to specified JIDs (group or individual).
 * - 🎵 Supports forwarding audio messages with PTT option.
 * - ⚙️ Handles errors gracefully and provides informative responses.
 * Each function processes the provided input and returns the appropriate result with emojis for an engaging user experience.
 */
