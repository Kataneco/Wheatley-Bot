const Discord = require('discord.js');
const client = new Discord.Client();
const { exec } = require('child_process');
const { config, stdout, stderr } = require('process');
const ytdl = require('ytdl-core');
const yts = require('yt-search'); 
const fs = require('fs');

var prefix = '-';
var save = '';

var servers = {};

var program;

client.on("message", message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    var args = message.content.replace('\n', ' ').slice(prefix.length).trim().split(/ +/);
    var cmd = args.shift();

    var trim = prefix.length + cmd.length + 1;

    switch (cmd) {
        case "debug":
            message.channel.send('beep boop');
            break;

        case "help":
            //send help
            break;

        case "eval":
            try {
                let result = eval(`try{${save}}catch{} `+message.content.slice(trim));
                message.channel.send(result);
            } catch {

            }
            break;

        case "save":
            save += message.content.slice(trim);
            break;

        case "clear":
            save = '';
            break;

        case 'get':
            try {
                message.channel.send("Success",  {files: [`${args[0]}`]});
            } catch {
            }
            break;

        case "exec":
            exec(message.content.slice(trim), (error, stdout, stderr) => {
                message.channel.send(`${stdout} ${stderr}`);
            });
            break;

        case "run":
            //Supported langs; JS - C/C++ - Rust
            message.channel.messages.fetch(args[0]).then(run => {
                if(run.content.startsWith("```js")){
                    let result = eval(run.content.substr(-3, 5));
                    message.channel.send(result);
                } else {

                }
            });
            break;

        case "write":
            try{
                var file = args.shift();
                fs.writeFile(`${file}`, `${connectArgs(trim + file.length + 1)}`, function(err){msg.channel.send(err);});
            } catch {
            }
            break;

        case 'play':
            if(!args[0]) {
                message.channel.send('OK, playing NULL.');
                return;
            }
        
            if(!message.member.voice.channel) {
                msg.channel.send('ur not in a vc bruv');
                return;
            }

            if(!message.guild.voice){
                message.member.voice.channel.join().then(() => { message.member.voice.channel.leave(); });
            }

            if(!servers[message.guild.id]){
                servers[message.guild.id] ={
                    queue: [],
                    list: []
                };
            }
        
            (async () => {
            var server = servers[message.guild.id];
        
            var q = '';
            args.forEach(element => q += element + ' ');

            const r = await yts(q);
            const video = r.videos.shift();

            server.queue.push(video.url);
            server.list.push(video.title);
            message.channel.send(`Added ${video.title} to the queue`);

            if(!message.guild.voice.connection){
                let voiceChannel = message.member.voice.channel;
                voiceChannel.join().then(connection => {
                    server.loop = false;
                    server.volume = 1;
                    server.connection = connection;
                    play(message, connection);
                });
            }
            })();
            break;

            case 'disconnect':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.connection) return;
                server.queue.splice(0, server.queue.length);
                server.list.splice(0, server.list.length);
                server.connection.disconnect();
                break;
    
            case 'skip':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.dispatcher) return;
                if(server.loop) server.loop = false;
                server.dispatcher.end();
                break;
    
            case 'volume':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.dispatcher) return;
                args[0] = Math.abs(args[0]) > 200 ? 200 : args[0];
                server.volume = args[0] / 100;
                server.dispatcher.setVolume(args[0] / 100);
                break;
    
            case 'resume':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.dispatcher) return;
                server.dispatcher.resume();
                break;
            
            case 'pause':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.dispatcher) return;
                server.dispatcher.pause();
                break;
            
            case 'loop':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.loop) return;
                server.loop = !server.loop;
                msg.channel.send("**Looping:** "+server.loop);
                break;
            
            case 'queue':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.list) return;
                var queue = '';
                var i = 1;
                server.list.forEach(element => { queue += `${i}. ` + element + '\n'; i++; });
                msg.channel.send('**``' + queue + '``**');
                break;
            
            case 'remove':
                var server = servers[message.guild.id];
                if(!server) return;
                if(!server.queue || !server.list) return;
                if(args[0] != 'all') {
                    server.queue.splice(args[0]-1, 1);
                    server.list.splice(args[0]-1, 1);
                } else {
                    server.queue.splice(1, server.queue.length);
                    server.list.splice(1, server.list.length);
                }
                break;
        
        case "program":
            //later
            break;

        case "reset":
            process.exit(1);
            break;

        case "how":
            message.channel.send(`${message.content.slice(args[0].length + args[1].length + trim + 1)} ${args[1]} %${Math.round(Math.random() * 100)} ${args[0]}`);
            break;
        
        default:
            break;
    }
});

function play(msg, connection){
    var server = servers[msg.guild.id];

    server.dispatcher = connection.play(ytdl(server.queue[0], {filter: 'audioonly'}));
    server.dispatcher.setVolume(server.volume);

    if(!server.loop) { server.queue.shift(); server.list.shift(); }

    server.dispatcher.on('finish', () => {
        if(server.queue[0]) play(msg, connection);
        else connection.disconnect();
    });
}

client.login(process.env.TOKEN);