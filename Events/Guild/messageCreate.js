const fs = require("fs");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const settings = JSON.parse(
      fs.readFileSync("./data/settings.json", "utf8")
    );
    const guildSettings = settings[message.guild.id] || { prefix: "!" };
    const prefix = guildSettings.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = client.commands.get(cmdName);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(`❌ Error in command ${cmdName}:`, err);
      message.reply("There was an error executing that command.");
    }
  },
};
