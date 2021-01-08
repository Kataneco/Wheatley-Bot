const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();

  if (debug){
    msg.channel.send(cmd)
    msg.channel.send(args)
  }

  try{
    if(cmd === 'eval'){
      var result = eval(connectArgs())
      msg.channel.send(result)
    }
  }
  catch{
    msg.channel.send(cmd)
    msg.channel.send(args)
  }

});

client.login(process.env.TOKEN);

function connectArgs(){
  var value
  args.forEach(element => {
    value += element + ' '
  });
  return value
}