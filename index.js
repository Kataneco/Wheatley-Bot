const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');
const fs = require('fs');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Minecraft`);
  exec("apt-get update && apt-get install build-essential", (error, stdout, stderr) => {});
});

var funcsave = '';

var lastArg;
var evalarg;
var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
  

	const args = msg.content.replace('\n', ' ').slice(config.prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  lastArg = args;

  try{
    if(cmd === 'eval'){
      connectArgs();
      var result = eval(`try{${funcsave}}catch(e){msg.channel.send(e);}`+`${evalarg}`);
      msg.channel.send(result);
    }
  }
  catch(err){
    if(debug){
    msg.channel.send(err);
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
    msg.channel.send(`
     **${config.prefix} eval <code>**
    **${config.prefix} func <code>**
    **${config.prefix} clear (clears saved functions)**

    **${config.prefix} exec <command>**
    **${config.prefix} dir (shows bot directory)**
    **${config.prefix} upload <link>**

    **${config.prefix} new <file name>**
    **${config.prefix} write <file name> <content>**
    `)
  }

  if(cmd === 'reset'){
    msg.channel.send('Resetting...')
    process.exit(1)
  }
  //if (cmd === kill){msg.channel.send('me kill'); exec("node start"); process.exit()}

  if(cmd === 'func'){
    connectArgs();
    funcsave += evalarg;
  }

  if(cmd === 'clear')funcsave = '';

  if(cmd === 'exec'){

    exec(`${evalarg}`, (error, stdout, stderr) => {msg.channel.send(`${stdout}\n${stderr}`);});
  }

  if(cmd === 'upload'){
    exec(`wget ${args}`, (error, stdout, stderr) => {
      msg.channel.send(stdout);
      if(debug) msg.channel.send(`${stdout}\n${stderr}`);
      if(!stderr) msg.channel.send('Success'); else msg.channel.send('Failed');
    });
  }

  if(cmd === 'dir'){
    exec("ls", (error, stdout, stderr) => {
      msg.channel.send(stdout);
      msg.channel.send(stderr);
      });
  }
  try{
  if(cmd === 'new'){
    fs.writeFile(`${args[0]}.cpp`, '', function(err){if(err)msg.channel.send(err);});
  }

  if(cmd === 'write'){
    var file = args.shift();
    var code = assemble(msg.content, file.length + config.prefix.length + cmd.length);
    fs.writeFile(`${file}.cpp`, `${code}`, function(err){if(err)msg.channel.send(err);});
  }
  }catch(e){
    msg.channel.send(e);
  }
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

function assemble(code, cut){
  var result = '';
  result = code.slice(cut);
  return result;
}