 else if(run.content.startsWith("```kt")){
                        extension = 'kt';
                        fs.writeFile(`${message.id}.kt`, run.content.substring(5, run.content.length - 3), (err) => {
                          exec(`kotlinc ${message.id}.kt -include-runtime -d ${message.id}.jar`, (error, stdout, stderr) => {
                            message.channel.send(`${stdout} ${stderr}`);
                            exec(`java -jar ${message.id}.jar`, (error, stdout, stderr) => {
                              message.channel.send(`${stdout} ${stderr}`)
                            })
                          });
                        });
                      }
