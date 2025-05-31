module.exports = {
  name: 'ban',
  description: 'Ban a member',
  async execute(message, args) {
    const member = message.mentions.members.first();
    if (!member) return message.reply('Please mention a member to ban.');
    if (!message.member.permissions.has('BanMembers')) return message.reply('You lack permission.');
    if (!member.bannable) return message.reply('I cannot ban this user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await member.ban({ reason });
    message.reply(`${member.user.tag} was banned. Reason: ${reason}`);
  }
};
