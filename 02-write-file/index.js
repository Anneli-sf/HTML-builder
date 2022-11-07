const { stdin, stdout } = process;
const fs = require("fs");
const path = require("path");
const toResFile = path.join(__dirname, "greeting.txt");
const output = fs.createWriteStream(toResFile); //поток записи

stdout.write("Please, write something: ");

stdin.on("data", (data) => {
  const dataStringified = data.toString();

  if (dataStringified.match("exit")) {
    process.exit();
  } else {
    output.write(data);
    stdout.write("Please, write smth else or 'exit': ");
  }
});

process.on("SIGINT", () => {
  process.exit();
});

process.on("exit", () => stdout.write("\nThanks and see you later!")); //выход из программы
