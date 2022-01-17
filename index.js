const { exec } = require("child_process");

function run() {
  exec("node main.js", (x, y, z) => run());
}

run();
