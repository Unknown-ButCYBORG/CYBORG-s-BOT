const GuildSettings = require("../../Models/guildSettings");
module.exports = {
  name: "channelDelete",
  async execute(channel) {
    if (!channel.guild) return;

    const guildSettings = await GuildSettings.findOne({ guildID: channel.guild.id });
    if (!guildSettings?.modlog?.enabled || !guildSettings.modlog.channel) return;

    const logChannel = channel.guild.channels.cache.get(guildSettings.modlog.channel);
    if (logChannel?.permissionsFor(channel.guild.members.me).has("SendMessages")) {
      logChannel.send(`🗑️ Channel **#${channel.name}** was deleted.`);
    }
  }
};
