function reverse(a) {
  return [...a].reverse();
}

function Stack(initial) {
  let data = initial || [];

  this.push = function(a) {
    if (Array.isArray(a)) {
      for (let val of a) {
        data.push(val);
      }
      return;
    }

    data.push(a);
  };

  this.pop = function() {
    return data.pop();
  };

  this.clear = function() {
    data = [];
  };

  this.all = function() {
    return data;
  };

  this.notEmpty = function() {
    return data.length > 0;
  }
}

Stack.prototype.toString = function() {
  return reverse(this.all()).join("");
};

function stackFromString(str) {
  return new Stack(str.split("").reverse());
}
const stack = new Stack();
let input = "";

function init(str) {
  input = stackFromString(str + "$");
  stack.clear();
  stack.push("$");
  stack.push("T");
}

const table = {
  T: {
    a: reverse(["a", "T", "c"]),
    b: "R",
    c: "R",
    $: "R",
  },
  R: {
    b: reverse(["b", "R"]),
    c: "",
    $: "",
  }
};

function isTerminal(v) {
  return table[v] === undefined;
}

function parse() {
  let max = 10000;
  while (stack.notEmpty()) {
    logData();
    check();
    max--;
    if (max === 0) {
      throw new Error("Maximum parse length exceeded.");
    }
  }
}

function check() {
  const nextInput = input.pop();
  const nextSymbol = stack.pop();

  if (isTerminal(nextSymbol)) {
    if (nextSymbol !== nextInput) {
      throw new Error("Expected " + nextSymbol + ", got " + nextInput);
    }
  } else {

    const translation = table[nextSymbol][nextInput];
    if (translation === undefined) {
      throw new Error("Unexpected symbol " + nextInput);
    }
    if (translation !== "") {
      stack.push(translation);
    }

    input.push(nextInput);
  }
}

function logData() {
  console.log(input.toString() + "\t" + stack.toString());
}

function main(str) {
  init(str);
  parse();
  console.log("the chain '" + str + "' is valid !");
}

main("aabcc");
