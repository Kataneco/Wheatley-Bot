const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Failing to interpret`);
});

var funcsave = '';

var lastArg
var evalarg
var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
  

	const args = msg.content.replace('\n', ' ').slice(config.prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  lastArg = args

  try{
    if(cmd === 'eval'){
      connectArgs()
      var result = eval(`try{${funcsave}}catch(e){msg.channel.send(e);}`+`${evalarg}`)
      msg.channel.send(result)
    }
  }
  catch(err){
    if(debug){
    msg.channel.send(cmd + evalarg)
    msg.channel.send(err)
    }
  }

  if(cmd === 'host'){
    connectArgs();
    host(evalarg);
  }

  if(cmd === 'how'){
    var random = Math.round(Math.random() * 100)
    msg.channel.send(`${args[2]} ${args[1]} %${random} ${args[0]}`)
  }

  if(cmd === 'help' || cmd === 'elp'){
    msg.channel.send(`**${config.prefix} eval <code>**\n**${config.prefix} func <code>**\n **${config.prefix} clear (clears saved functions)**`)
  }

  if(cmd === 'reset'){
    msg.channel.send('Resetting...')
    process.exit(1)
  }

  if(cmd === 'func'){
    connectArgs();
    funcsave += evalarg;
  }

  if(cmd === 'clear')funcsave = '';
});

client.login(process.env.TOKEN);

function connectArgs(){
  evalarg = ''
  lastArg.forEach(element => {
    evalarg += element + " "
  });
}

async function host(char){
  try{
    eval(`${char}`);
  }
  catch(err){
  }
}

async function keepAlive(){
  while(client.users.fetch('796629573428183060').presence.status === "online"){
    continue;
  }
  client.login(process.env.TOKEN);
  keepAlive();
}