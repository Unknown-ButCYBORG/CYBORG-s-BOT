const GuildSettings = require("../../Models/guildSettings");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const guildID = message.guild.id;

    let settings = await GuildSettings.findOne({ guildID });
    if (!settings) {
      settings = await GuildSettings.create({ guildID });
    }

    const prefix = settings.prefix || "!";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
      try {
        return command.execute(message, args, client);
      } catch (err) {
        console.error("❌ Error executing command:", err);
        return message.reply("There was an error executing that command.");
      }
    }

    if (settings.customCommands && settings.customCommands.has(commandName)) {
      return message.channel.send(settings.customCommands.get(commandName));
    }
  },
};
