module.exports = {
  name: "help",
  description: "List all available commands",
  async execute(message, args, client) {
    const commands = client.commands.map(cmd => `🔹 **${cmd.name}** — ${cmd.description || 'No description'}`).join("\n");

    message.channel.send({
      content: `📖 **Available Commands:**\n\n${commands}`
    });
  }
};
