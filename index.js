const { exec } = require("child_process");
const fs = require('fs');
const fetch = require("node-fetch");

function run() {
  const url = "https://raw.githubusercontent.com/Hornet07/Wheatley-Bot/main/main.js"
  fetch(url)
   .then( r => r.text() )
   .then( t => fs.writeFile('main.js.real', t, err => exec("node main.js", (x, y, z) => run())));
}

run();
