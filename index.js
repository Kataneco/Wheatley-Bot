const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');
const fs = require('fs');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Minecraft`);
  //exec("", (error, stdout, stderr) => {});
});

var funcsave = '';

var lastArg;
var evalarg;
var debug = false;
var public;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
  

	const args = msg.content.replace('\n', ' ').slice(config.prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  lastArg = args;
  public = msg;

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
    msg.channel.send(config.help);
  }

  if(cmd === 'reset'){
    msg.channel.send('Resetting...');
    process.exit(1);
  }

  //if (cmd === kill){msg.channel.send('me kill'); exec("node start"); process.exit()}

  if(cmd === 'func'){
    connectArgs();
    funcsave += evalarg;
  }

  if(cmd === 'clear')funcsave = '';

  if(cmd === 'exec'){
    connectArgs();
    exec(`${evalarg}`, (error, stdout, stderr) => {msg.channel.send(`${stdout}\n${stderr}`);});
  }

  
  if(cmd === 'upload'){
    exec(`wget ${args[0]}`, (error, stdout, stderr) => {
      msg.channel.send(stdout);
      if(debug) msg.channel.send(`${stdout}\n${stderr}`);
      //if(stderr.length < 10) msg.channel.send('Success'); else msg.channel.send('Failed');
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
    fs.writeFile(`${args[0]}`, '', function(err){if(err) msg.channel.send(err);});
  }

  if(cmd === 'write'){
    var file = args.shift();
    var code = assemble(msg.content, config.prefix.length + cmd.length + file.length + 2 + 1);
    connectArgs();
    fs.writeFile(`${file}`, `${code}`, function(err){if(err) msg.channel.send(err);});
    //fs.writeFile(`${file}.cpp`, `${args}`, function(err){if(err)msg.channel.send(err);});
  }
  }catch(e){
    msg.channel.send(e);
  }

  if(cmd === 'play'){
    connectArgs();
    var voiceChannel = msg.member.voice.channel; voiceChannel.join().then(connection =>{const dispatcher = connection.play(args[0]); dispatcher.on("end", end => {voiceChannel.leave();});}).catch(err => console.log(err));
  }

  if(cmd === 'dc'){
    msg.member.voice.channel.leave();
  }
});

client.login(process.env.TOKEN);

function connectArgs(){
  evalarg = ''
  lastArg.forEach(element => {
    evalarg += " " + element;
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

async function whoAsked(){
  var msg = await public.channel.send('https://tenor.com/view/who-tf-asked-nasas-radar-dish-who-asked-nobody-asked-gif-17675657');
  setTimeout(() => {msg.edit('https://tenor.com/view/running-fast-who-asked-meme-type-this-in-to-find-it-gif-17918036');}, 5000);
  setTimeout(() => {msg.edit('No one.');}, 3500);
}