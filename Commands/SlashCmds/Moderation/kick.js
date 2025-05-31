const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) {
      return interaction.reply({ content: '❌ Could not find that user in this server.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '❌ I cannot kick this user. They may have a higher role or I lack permissions.', ephemeral: true });
    }

    try {
      await member.kick(reason);
      await interaction.reply(`✅ Kicked ${member.user.tag}. Reason: ${reason}`);
    } catch (err) {
      console.error('Kick command error:', err);
      await interaction.reply({ content: '❌ Failed to kick the user.', ephemeral: true });
    }
  }
};
