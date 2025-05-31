const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Display a user avatar')
    .addUserOption(option => option.setName('user').setDescription('Target user')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    interaction.reply(user.displayAvatarURL({ dynamic: true, size: 1024 }));
  }
};
