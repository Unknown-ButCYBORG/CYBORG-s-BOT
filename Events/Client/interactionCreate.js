const GuildSettings = require("../../Models/guildSettings");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({ content: "⚠️ Command not found.", ephemeral: true });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Error in slash command ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    }

    
    if (interaction.isButton() && interaction.customId === "verify_button") {
      const guild = interaction.guild;
      const member = interaction.member;
      const settings = await GuildSettings.findOne({ guildID: guild.id });

      if (!settings?.verification?.enabled || !settings.verification.role)
        return interaction.reply({ content: "Verification system is not configured.", ephemeral: true });

      const role = guild.roles.cache.get(settings.verification.role);
      if (!role) return interaction.reply({ content: "⚠️ Role not found.", ephemeral: true });

      try {
        await member.roles.add(role);
        await interaction.reply({ content: "✅ You’ve been verified!", ephemeral: true });
        try {
          await member.send(`✅ Verified in **${guild.name}**!`);
        } catch {}
      } catch (err) {
        console.error("Verification error:", err);
        interaction.reply({ content: "Failed to assign role. Contact staff.", ephemeral: true });
      }
    }

    
    if (interaction.isButton() && interaction.customId.startsWith("role_")) {
      const guild = interaction.guild;
      const member = interaction.member;
      const roleId = interaction.customId.split("_")[1];

      const role = guild.roles.cache.get(roleId);
      if (!role) {
        return interaction.reply({ content: "⚠️ Role not found.", ephemeral: true });
      }

      const hasRole = member.roles.cache.has(roleId);
      try {
        if (hasRole) {
          await member.roles.remove(roleId);
          await interaction.reply({ content: `❌ Removed role: ${role.name}`, ephemeral: true });
        } else {
          await member.roles.add(roleId);
          await interaction.reply({ content: `✅ Assigned role: ${role.name}`, ephemeral: true });
        }
      } catch (err) {
        console.error("Button role toggle error:", err);
        interaction.reply({ content: "⚠️ Couldn't update your role.", ephemeral: true });
      }
    }
  }
};
