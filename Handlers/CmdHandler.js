const fs = require('fs');
const path = require('path');
const { REST, Routes, Collection } = require('discord.js');
const config = require('../config.json');

module.exports = async (client) => {
  const prefixFolders = fs.readdirSync('./Commands/PrefixCmds');
  const slashFolders = fs.readdirSync('./Commands/SlashCmds');
  const slashCommandsArray = [];

 
  for (const folder of prefixFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/PrefixCmds/${folder}`)
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../Commands/PrefixCmds/${folder}/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
        console.log(`✅ Prefix Command Loaded: ${command.name}`);
      } else {
        console.warn(`❌ Skipping invalid prefix command: ${file}`);
      }
    }
  }

  
  for (const folder of slashFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/SlashCmds/${folder}`)
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../Commands/SlashCmds/${folder}/${file}`);
      if (command.data && command.execute) {
        client.slashCommands.set(command.data.name, command);
        slashCommandsArray.push(command.data.toJSON());
        console.log(`✅ Slash Command Loaded: ${command.data.name}`);
      } else {
        console.warn(`❌ Skipping invalid slash command: ${file}`);
      }
    }
  }

  
  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: slashCommandsArray }
    );
    console.log('🚀 Slash commands registered.');
  } catch (err) {
    console.error('❌ Error registering slash commands:', err);
  }
};
