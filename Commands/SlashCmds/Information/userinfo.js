const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get info about a user')
    .addUserOption(opt => opt.setName('user').setDescription('Target user')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    interaction.reply(`👤 User: ${user.tag}\n🆔 ID: ${user.id}\n📆 Created: ${user.createdAt.toDateString()}`);
  }
};
