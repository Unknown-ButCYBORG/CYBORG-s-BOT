module.exports = {
  name: 'kick',
  description: 'Kick a member',
  async execute(message, args) {
    const member = message.mentions.members.first();
    if (!member) return message.reply('Please mention a member to kick.');
    if (!message.member.permissions.has('KickMembers')) return message.reply('You lack permission.');
    if (!member.kickable) return message.reply('I cannot kick this user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await member.kick(reason);
    message.reply(`${member.user.tag} was kicked. Reason: ${reason}`);
  }
};
