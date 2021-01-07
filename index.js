const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login('Nzk2NjI5NTczNDI4MTgzMDYw.X_atGg.Ed5SnA20resjfL5WvJljTLXRnvw');