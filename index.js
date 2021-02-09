const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');
const fs = require('fs');
const ytdl = require('ytdl');
const yt = require('youtube-search');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Minecraft`);
});

var raw = false;
var save = '';
var cut = 1;
var public, message;
var debug = false;
client.on('message', msg => {
  if(msg.content === 'debug') debug = !debug;
  if (!msg.content.toLowerCase().startsWith(config.prefix) || msg.author.bot) return;
  
	const args = msg.content.replace('\n', ' ').slice(config.prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  public = args;
  message = msg;

  var trim = config.prefix.length + cmd.length + cut;

  try{
    if(cmd === 'eval'){
      var result = eval(`try{${save}}catch(e){msg.channel.send(e);}`+connectArgs(trim));
      msg.channel.send(result);
    }
  }
  catch(err){
    if(debug){
    msg.channel.send(err);
    }
  }

  if(cmd === 'host') host(connectArgs(trim));
  if(cmd === 'how') msg.channel.send(`${args[2]} ${args[1]} %${Math.round(Math.random() * 100)} ${args[0]}`)
  if(cmd === 'help' || cmd === 'elp') msg.channel.send(config.help);
  if(cmd === 'reset')process.exit(1);
  if(cmd === 'func') save += connectArgs(trim);
  if(cmd === 'clear') save = '';
  if(cmd === 'exec') exec(`${connectArgs(trim)}`, (error, stdout, stderr) => {msg.channel.send(`${stdout}\n${stderr}`);});
  
  try{
  if(cmd === 'new')fs.writeFile(`${args[0]}`, '', function(err){if(err) msg.channel.send(err);});

  if(cmd === 'write'){
    var file = args.shift();
    var code = assemble(msg.content, config.prefix.length + cmd.length + file.length + 2 + 1);
    fs.writeFile(`${file}`, `${code}`, function(err){if(err) msg.channel.send(err);});
  }
  }catch(e) {msg.channel.send(e);}

  if(cmd === 'play'){
    let voiceChannel = msg.member.voice.channel;
    voiceChannel.join().then(connection =>{
      const dispatcher = connection.play(args[0]);
    }).catch(err => console.log(err));
  }
  if(cmd === 'dc') msg.member.voice.channel.leave();
});

client.login(process.env.TOKEN);

function connectArgs(trim){
  var run = '';
  if(raw)
  public.forEach(element => {
      run += ' ' + element;
  });
  else run = message.slice(trim);
  return run;
}

async function host(char){
  try{eval(`${char}`);}
  catch(err){}
}

async function whoAsked(){
  var msg = await public.channel.send('https://tenor.com/view/who-tf-asked-nasas-radar-dish-who-asked-nobody-asked-gif-17675657');
  setTimeout(() => {msg.edit('https://tenor.com/view/running-fast-who-asked-meme-type-this-in-to-find-it-gif-17918036');}, 5000);
  setTimeout(() => {msg.edit('No one.');}, 8500);
}