const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var debug = true;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
  if(!msg.content.startsWith(config.prefix)) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/) //I have no idea what / +/ means lol
  const cmd = args.shift()

  if(debug){
    msg.channel.send(args)
    msg.channel.send(cmd)
  }
  try{
  if(cmd === 'eval') {
    var commmand = args.join(" ")
    var result = eval(String.raw(command))
    msg.channel.send(result)
  }
  } catch(err) {if (debug){msg.channel.send(err)}}
  //for(){}
});

client.login(process.env.TOKEN);