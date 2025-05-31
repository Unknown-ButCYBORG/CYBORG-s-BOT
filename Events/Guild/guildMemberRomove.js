const GuildSettings = require("../../Models/guildSettings");
module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const guildSettings = await GuildSettings.findOne({ guildID: member.guild.id });
    if (!guildSettings?.modlog?.enabled || !guildSettings.modlog.channel) return;

    const channel = member.guild.channels.cache.get(guildSettings.modlog.channel);
    if (channel?.permissionsFor(member.guild.members.me).has("SendMessages")) {
      channel.send(`👋 **${member.user.tag}** has left the server.`);
    }
  }
};
