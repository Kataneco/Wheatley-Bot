const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const python = require('python-bridge');
const py = python();
const {
  ex,
  end,
} = py;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`welp`);
});

var lastArg
var evalarg
var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

	const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  lastArg = args

  try{
    if(cmd === 'eval'){
      connectArgs()
      var result = eval('('+evalarg+')')
      msg.channel.send(result)
      eval(evalarg)
    }
  }
  catch(err){
    if(debug){
    msg.channel.send(cmd + evalarg)
    msg.channel.send(err)
    }
  }

  if(cmd === 'how'){
    var random = Math.round(Math.random() * 100)
    msg.channel.send(`${args[2]} ${args[1]} %${random} ${args[0]}`)
  }

  if(cmd === 'help' || cmd === 'elp'){
    msg.channel.send(`${config.prefix} eval <code>`)
  }

  if(cmd === 'reset'){
    msg.channel.send('Resetting...')
    process.exit(1)
  }

  if(cmd === 'py' || cmd === 'python'){
    try{
    connectArgs()
    bruh()
    msg.channel.send(pyRes.toString())
    }catch(err){
      if(debug){
        msg.channel.send(cmd + evalarg)
        msg.channel.send(err)
      }
    }
  }
});

client.login(process.env.TOKEN);

function connectArgs(){
  evalarg = ''
  lastArg.forEach(element => {
    evalarg += element + " "
  });
}

var pyRes;
async function bruh(){
  let result = await py(`eval(${evalarg})`);
  pyres = result;
}