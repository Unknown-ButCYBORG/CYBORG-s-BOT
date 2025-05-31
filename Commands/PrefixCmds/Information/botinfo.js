const os = require("os");
module.exports = {
  name: 'botinfo',
  description: 'Show info about the bot',
  execute(message, args, client) {
    const uptime = Math.floor(client.uptime / 1000);
    message.channel.send(`🤖 Bot Uptime: ${uptime}s\n📁 Commands: ${client.commands.size}\n📶 Ping: ${client.ws.ping}ms`);
  }
};
