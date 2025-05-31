module.exports = {
  name: 'avatar',
  description: 'Display a user\'s avatar',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

    message.channel.send({
      content: `🖼️ Avatar for **${user.tag}**:\n${avatarURL}`
    });
  }
};
