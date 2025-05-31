const GuildSettings = require("../../Models/guildSettings");
module.exports = {
  name: "guildBanAdd",
  async execute(ban) {
    const guildSettings = await GuildSettings.findOne({ guildID: ban.guild.id });
    if (!guildSettings?.modlog?.enabled || !guildSettings.modlog.channel) return;

    const channel = ban.guild.channels.cache.get(guildSettings.modlog.channel);
    if (channel?.permissionsFor(ban.guild.members.me).has("SendMessages")) {
      channel.send(`⛔ **${ban.user.tag}** was banned.`);
    }
  }
};
