const { exec } = require("child_process");
const fs = require('fs');

function run() {
  const url = "https://raw.githubusercontent.com/Hornet07/Wheatley-Bot/main/main.js"
  fetch(url)
   .then( r => r.text() )
   .then( t => fs.writeFile('main.js', t, err => exec("node main.js", (x, y, z) => run())));
}

run();
