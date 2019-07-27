const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt() {
  rl.question("Type a formula : ", (formula) => {
    try {
      console.log(tokenizeWithStateMachine(formula))
    } catch (e) {
      console.error(e.message);
    }
    prompt();
  });
}

function main() {
  prompt();
}

function tokenizeWithStateMachine(input) {
  let tokens = [];
  let buff = "";
  let state = 1;

  let i = 0;
  for (let i = 0; i < input.length; i++) {
    let cur = input[i];
    if (cur === " ")
      continue;

    switch (state) {
      case 1:
        if (cur.match(/[0-9]/)) {
          buff += cur;
        } else if (cur.match(/[\-/*+]/)) {
          if (buff) {
            tokens.push("NUMBER_LITERAL");
            tokens.push(buff);
            buff = "";

            if (cur === "-") tokens.push("MINUS");
            else if (cur === "+") tokens.push("PLUS");
            else if (cur === "/") tokens.push("DIVIDED_BY");
            else tokens.push("TIMES");
          }

          state = 2;
        } else {
          throw new Error("Unexpected " + cur + ".");
        }
        break;
      case 2:
        if (cur.match(/[0-9]/)) {
          buff += cur;
          state = 1;
        } else {
          throw new Error("Unexpected " + cur + ".");
        }
        break;
    }
  }

  if (state === 2) {
    throw new Error("Uncomplete syntax.");
  }

  if (buff) {
    tokens.push("NUMBER_LITERAL");
    tokens.push(buff);
  }
  return tokens;
}
function tokenizeTraditional(input) {
  let tokens = [];

  let i = 0;
  for (let i = 0; i < input.length; i++) {
    let cur = input[i];
    if (cur === " ")
      continue;

    if (cur === "+")
      tokens.push("PLUS");
    else if (cur === "-")
      tokens.push("MINUS");
    else if (cur === "*")
      tokens.push("TIMES");
    else if (cur === "/")
      tokens.push("DIVIDED_BY");
    else if (cur.match(/[0-9]/)) {
      tokens.push("NUMBER");
      tokens.push(cur);
    } else {
      console.warn("Unrecognized token " + cur);
    }
  }

  return tokens;
}

main();
