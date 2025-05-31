const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Get info about the server'),
  async execute(interaction) {
    const guild = interaction.guild;
    interaction.reply(`📛 Server: ${guild.name}\n🆔 ID: ${guild.id}\n👥 Members: ${guild.memberCount}\n📆 Created: ${guild.createdAt.toDateString()}`);
  }
};
