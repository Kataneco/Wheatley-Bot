const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var lastArg
var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
	if (!msg.content.startsWith(config.prefix)) return;

	const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  lastArg = args

  if (debug){
    msg.channel.send(cmd)
    msg.channel.send(args)
  }

  try{
    if(cmd === 'eval'){
      var result = eval(connectArgs.ret())
      msg.channel.send(result)
    }
  }
  catch(err){
    msg.channel.send(cmd)
    msg.channel.send(args)
    msg.channel.send(err)
  }

});

client.login(process.env.TOKEN);

var connectArgs = {
  ret: function() {
    var value
    lastArg.forEach(element => {
      value += element + ' '
    });
    return value
  }
}