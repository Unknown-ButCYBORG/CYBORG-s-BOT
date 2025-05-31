module.exports = {
  name: 'ping',
  description: 'Check the bot\'s latency',
  async execute(message, args, client) {
    const sent = await message.channel.send('🏓 Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    sent.edit(`🏓 Pong! Latency: ${latency}ms | API: ${apiLatency}ms`);
  }
};
