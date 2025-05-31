const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Bot information'),
  async execute(interaction, client) {
    const uptime = Math.floor(client.uptime / 1000);
    interaction.reply(`🤖 Bot is online!\n⏱ Uptime: ${uptime}s\n📶 Ping: ${client.ws.ping}ms`);
  }
};
