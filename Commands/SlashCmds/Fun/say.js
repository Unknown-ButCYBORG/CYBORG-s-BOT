const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say a message')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), 

  async execute(interaction) {
    const msg = interaction.options.getString('message');

    await interaction.reply({ content: '📢 Message sent!', ephemeral: true });
    await interaction.channel.send(msg);
  }
};
