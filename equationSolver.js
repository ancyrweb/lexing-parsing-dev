const readline = require('readline');
const tokenize = require("./equationSolver/lexer");
const parse = require("./equationSolver/parser");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt() {
  rl.question("Type a formula : ", (formula) => {
    try {
      const tokenized = tokenize(formula);
      const parsed = parse(tokenized);
      console.log(parsed)
    } catch (e) {
      console.error(e.message);
    }
    prompt();
  });
}

function main() {
  parse(tokenize("1=2"));
  console.log("done.");
  // prompt();
}

main();
