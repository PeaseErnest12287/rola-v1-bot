/* Copyright (C) 2025 Pease Ernest.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Pease Ernest - rolav1
*/

const { getFilter, setFilter, deleteFilter } = require("../lib/db/filters");
const { rolav1, isPrivate } = require("../lib");

// 🛠️ Add a filter that triggers a specific response
rolav1(
  {
    pattern: "filter",
    fromMe: true,
    desc: "Adds a filter. When someone triggers the filter, it sends the corresponding response. To view your filter list, use `.filter`.",
    usage: ".filter keyword:message",
    type: "group",
  },
  async (message, match) => {
    let text, msg;
    try {
      [text, msg] = match.split(":");
    } catch {}
    if (!match) {
      // Retrieve and display the list of active filters
      const filters = await getFilter(message.jid);
      if (filters === false) {
        await message.reply("❌ No filters are currently set in this chat.");
      } else {
        let response = "📜 Your active filters for this chat:" + "\n\n";
        filters.map(
          (filter) => (response += `✒ ${filter.dataValues.pattern}\n`)
        );
        response += "🛠️ Use: `.filter keyword:message` to set a filter";
        await message.reply(response);
      }
    } else if (!text || !msg) {
      return await message.reply(
        "🛠️ Use: `.filter keyword:message` to set a filter"
      );
    } else {
      // Set a new filter
      await setFilter(message.jid, text, msg, true);
      return await message.reply(`✅ Successfully set filter for ${text}`);
    }
  }
);

// 🛑 Remove a previously added filter
rolav1(
  {
    pattern: "stop",
    fromMe: true,
    desc: "Stops a previously added filter.",
    usage: '.stop "hello"',
    type: "group",
  },
  async (message, match) => {
    if (!match) return await message.reply("\n*Example:* ```.stop hello```");

    // Delete the specified filter
    const del = await deleteFilter(message.jid, match);
    await message.reply(`✅ Filter ${match} deleted`);

    if (!del) {
      await message.reply("❌ No existing filter matches the provided input.");
    }
  }
);

// 📝 Respond to messages that match any active filters
rolav1(
  { on: "text", fromMe: false, dontAddCommandList: true },
  async (message, match) => {
    const filters = await getFilter(message.jid);
    if (!filters) return;
    filters.map(async (filter) => {
      const pattern = new RegExp(
        filter.dataValues.regex
          ? filter.dataValues.pattern
          : "\\b(" + filter.dataValues.pattern + ")\\b",
        "gm"
      );
      if (pattern.test(match)) {
        await message.reply(filter.dataValues.text, {
          quoted: message,
        });
      }
    });
  }
);

/**
 * 📜 This bot, created by Pease Ernest, provides functionalities to add, remove, and manage filters:
 * - 🛠️ Adding filters that trigger specific responses when matched.
 * - 🛑 Removing previously added filters.
 * - 📝 Responding to messages that match any active filters.
 * Each function processes the provided input and returns the appropriate result with emojis for an engaging user experience.
 */
