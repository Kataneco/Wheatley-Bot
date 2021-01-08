const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
  if(!msg.content.startsWith(config.prefix)) return;
  const args = msg.content.slice(config.prefix.length) //I have no idea what / +/ means lol
  const cmd = args.split(" ")
  args = args.slice(cmd[0].length+1)

  try{
    if(cmd[] === 'eval'){
      var result = eval(args)
      msg.channel.send(result)
    }
  }
  catch{
    
  }

});

client.login(process.env.TOKEN);