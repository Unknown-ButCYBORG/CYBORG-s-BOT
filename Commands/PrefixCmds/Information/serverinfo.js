module.exports = {
  name: 'serverinfo',
  description: 'Display info about this server',
  execute(message) {
    const { guild } = message;
    message.channel.send(`📛 Name: ${guild.name}\n👥 Members: ${guild.memberCount}\n🆔 ID: ${guild.id}\n📆 Created: ${guild.createdAt.toDateString()}`);
  }
};
