module.exports = {
  name: 'say',
  description: 'Make the bot say something',
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) return message.reply("Please provide a message to say.");
    message.delete();
    message.channel.send(text);
  }
};
