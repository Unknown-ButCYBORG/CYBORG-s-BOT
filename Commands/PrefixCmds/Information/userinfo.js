module.exports = {
  name: 'userinfo',
  description: 'Get information about a user',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);
    message.reply({
      content: `👤 **User:** ${user.tag}\n🆔 **ID:** ${user.id}\n📅 **Joined:** ${member.joinedAt.toDateString()}\n⏰ **Created:** ${user.createdAt.toDateString()}`
    });
  }
};
