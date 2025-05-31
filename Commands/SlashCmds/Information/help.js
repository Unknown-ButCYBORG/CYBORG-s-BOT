const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('List all available slash commands'),
  async execute(interaction, client) {
    const commands = client.slashCommands.map(cmd => `🔹 **/${cmd.data.name}** — ${cmd.data.description}`).join("\n");

    interaction.reply({
      content: `📖 **Available Slash Commands:**\n\n${commands}`,
      ephemeral: true
    });
  }
};
