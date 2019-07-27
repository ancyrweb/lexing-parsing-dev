let next = "";
let input = "";
let i = 0;

function init(str) {
  input = str;
  next = input.length > 0 ? input[i] : "$";
}

function match(what) {
  if (next === what) {
    if (i < input.length - 1) {
      i++;
      next = input[i];
    } else {
      next = "$";
    }
    return;
  }

  err(what);
}

function parseR() {
  if (next === "c") {
    // do nothing
  } else if (next === "b") {
    match("b"); parseR();
  }
}
function parseT() {
  if (next === "a") {
    match("a"); parseT(); match("c");
  } else if (next === "b" || next === "c" || next === "$") {
    parseR();
  } else {
    err("nothing");
  }
}

function parse() {
  return parseT() + match("$");
}

function err(what) {
  throw new Error("Expected " + what + ", got " + next);
}

function main(str) {
  init(str);
  parse();
  console.log("the chain '" + str + "' is valid !");
}

main("bb");
