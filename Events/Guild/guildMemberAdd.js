const GuildSettings = require("../../Models/guildSettings");
module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const guildSettings = await GuildSettings.findOne({ guildID: member.guild.id });
    if (!guildSettings) return;

    
    if (guildSettings.welcome?.enabled && guildSettings.welcome.channel && guildSettings.welcome.message) {
      const channel = member.guild.channels.cache.get(guildSettings.welcome.channel);
      if (channel?.viewable && channel.permissionsFor(member.guild.members.me).has("SendMessages")) {
        const welcomeMsg = guildSettings.welcome.message.replace("{user}", `<@${member.id}>`);
        channel.send(welcomeMsg).catch(console.error);
      }
    }

    
    if (guildSettings.autorole?.enabled && guildSettings.autorole.role) {
      const role = member.guild.roles.cache.get(guildSettings.autorole.role);
      if (role) {
        member.roles.add(role).catch(console.error);
      }
    }
  }
};
