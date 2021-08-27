const Discord = require("discord.js");
const { exec } = require("child_process");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const fs = require("fs");
const { stderr } = require("process");

const client = new Discord.Client();
var servers = {};

client.on("message", message => {
        if(!servers[message.guild.id]){
        servers[message.guild.id] = {
            prefix: "-",

            eval: "",
            commands: [],
            actions: [],

            queue: [],
            list: [],

            loop: false,
            volume: 1,
        }
    }

    var server = servers[message.guild.id];

    if(!message.content.startsWith(server.prefix) || message.author.bot) return;
    
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const trim = server.prefix.length + command.length + 1;

    switch(command) {
        case "eval":
            let result = eval(`try{${sevrer.eval}}catch{} try{${message.content.slice(trim)}}catch{}`);
            if(!result) return;
            message.channel.send(result);
            break;

        case "save":
            server.eval += message.content.slice(trim);
            break;
        
        case "clear":
            server.eval = "";
            break;

        case "exec":
            exec(message.content.slice(trim), (error, stdout, stderr) => message.channel.send(`${stdout}\n${stderr}`));
            break;

        case "get":
            try {
                message.channel.send("_ _", {files: args});
            } catch {}
            break;

        case "write":
            const file = args.shift();
            const id = args.shift();
            message.channel.messages.fetch(id).then(write => {
                fs.writeFile(file, write.content.substring(3, write.content.length - 3), err => {});
            });
            break;

        case "run":
            message.channel.messages.fetch(args[0]).then(run => {
                const data = getLanguage(run.content);
                const code = run.content.substring(data.cut, run.content.length - 3);

                switch (data.lang) {
                    case "js":
                        let result = eval(code);
                        if(!result) return;
                        message.channel.send(result);
                        break;

                    case "c":
                        fs.writeFile(`${message.id}.${data.lang}`, code, err=>{
                            exec(`gcc ${message.id}.${data.lang} -o ${message.id} -O3`, (error, stdout, stderr) => {
                                message.channel.send(`${stdout}\n${stderr}`);
                                exec(`./${message.id}`, (error, stdout, stderr) => message.channel.send(`${stdout}\n${stderr}`));
                            });
                        });
                        break;
                    
                    case "rs":
                        fs.writeFile(`${message.id}.${data.lang}`, code, err=>{
                            exec(`rustc ${message.id}.${data.lang}`, (error, stdout, stderr) => {
                                message.channel.send(`${stdout}\n${stderr}`);
                                exec(`./${message.id}`, (error, stdout, stderr) => message.channel.send(`${stdout}\n${stderr}`));
                            });
                        });
                        break;

                    case "py":
                        fs.writeFile(`${message.id}.${data.lang}`, code, err=>{
                            exec(`pypy ${message.id}.${data.lang}`, (error, stdout, stderr) => message.channel.send(`${stdout}\n${stderr}`));
                        });
                        break;

                    default:
                        return;
                }

                setTimeout(() => exec(`rm ${message.id} ${message.id}.${data.lang}`), 10000);
            });
            break;

        case 'play':
            if(!args[0] || !message.member.voice.channel) return;

            yts({pages: 1, query: message.content.slice(trim)}).then(r => {
                const video = r.videos.shift();

                server.queue.push(video.url);
                server.list.push(video.title);
                message.channel.send(`Added **${video.title}** to the queue`);

                if(!message.guild.voice?.connection){
                    message.member.voice.channel.join().then(connection => {
                        server.connection = connection;
                        play(server, message.channel);
                    });
                }
            });
            break;

        case 'disconnect':
            if(!server.connection) return;
            server.queue = [];
            server.list = [];
            server.connection.disconnect();
            break;

        case 'skip':
            if(!server.dispatcher) return;
            if(server.loop) server.loop = false;
            server.dispatcher.end();
            break;

        case 'volume':
            if(!server.dispatcher) return;
            args[0] = Math.abs(args[0]) > 200 ? 200 : args[0];
            server.volume = args[0] / 100;
            server.dispatcher.setVolume(args[0] / 100);
            break;

        case 'resume':
            if(!server.dispatcher) return;
            server.dispatcher.resume();
            break;
        
        case 'pause':
            if(!server.dispatcher) return;
            server.dispatcher.pause();
            break;
        
        case 'loop':
            server.loop = !server.loop;
            message.channel.send("**Looping:** "+server.loop);
            break;
        
        case 'queue':
            if(!server.list) return;
            var queue = '';
            var i = 1;
            server.list.forEach(element => { queue += `${i}. ` + element + '\n'; i++; });
            message.channel.send('**``' + queue + '``**');
            break;
        
        case 'remove':
            if(!server.queue || !server.list) return;
            if(args[0] != 'all') {
                server.queue.splice(args[0]-1, 1);
                server.list.splice(args[0]-1, 1);
            } else {
                server.queue.splice(1, server.queue.length);
                server.list.splice(1, server.list.length);
            }
            break;
        }
});

client.login(process.env.TOKEN);

const langs = ["javascript", "python", "rust", "c++", "kotlin", "golang", "typescript", "lolcode", "brainfuck", "csharp"];
const extensions = ["js", "py", "rs", "cpp", "kt", "go", "ts", "lol", "bf", "cs"];
function getLanguage(content){
    var result = "";

    var i = 0;
    while(content[i] !== '\n'){
        result += content[i];
        i++;
    }

    result = result.slice(3);

    for(var i = 0; i < langs.length; i++){
        if(result === langs[i]){
            result = extensions[i];
            break;
        }
    }

    return {lang: result, cut: i};
}

function play(server, channel){
    channel.send(`Now playing **${server.list[0]}**`);
    server.dispatcher = server.connection.play(ytdl(server.queue[0], {filter: 'audioonly'}));
    server.dispatcher.setVolume(server.volume);

    if(!server.loop) { server.queue.shift(); server.list.shift(); }

    server.dispatcher.on('finish', () => {
        if(server.queue[0]) play(server, channel);
        else connection.disconnect();
    });
}