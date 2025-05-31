const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const eventFolders = fs.readdirSync('./Events');

  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(`./Events/${folder}`)
      .filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = require(`../Events/${folder}/${file}`);

      if (!event.name || typeof event.execute !== 'function') {
        console.warn(`❌ Skipping invalid event: ${file}`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      console.log(`✅ Event Loaded: ${file}`);
    }
  }
};
