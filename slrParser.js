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

  this.set = function(s) {
    data = s;
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

  this.peek = function() {
    return data[data.length - 1];
  };

  this.notEmpty = function() {
    return this.length() > 0;
  };

  this.length = () => data.length;
}

Stack.prototype.toString = function(rvs = true) {
  return (rvs ? reverse(this.all()) : this.all()).join("");
};

function Tree(value = "", childrens = []) {
  this.value = value;
  this.childrens = childrens.slice();
}

let appStack = new Stack();
let input = new Stack();
let state = 1;
let stackPointer = 0;
let lastAction = "";
let steps = 0;
let tree = null;

function init(arr) {
  appStack.clear();
  input.set([{ type: "$", value: null }, ...arr]);
  state = 1;
  tree = null;
}

const productions = {
  1: {
    left: "E",
    right: ["E", "+", "T"]
  },
  2: {
    left: "E",
    right: ["T"]
  },
  3: {
    left: "T",
    right: ["T", "*", "id"]
  },
  4: {
    left: "T",
    right: ["id"]
  }
};

const parseTable = {
  1: {
    id: "S2",
    E: "S3",
    T: "S6"
  },
  2: {
    reduce: "R4",
  },
  3: {
    "+": "S4",
    "-": "S4",
    "$": "ACCEPT",
  },
  4: {
    id: "S2",
    T: "S5",
  },
  5: {
    "*": "S7",
    "/": "S7",
    reduce: "R1"
  },
  6: {
    "*": "S7",
    "/": "S7",
    reduce: "R2"
  },
  7: {
    id: "S8",
  },
  8: {
    reduce: "R3",
  }
};


function isTerminal(v) {
  return table[v] === undefined;
}

function parse() {
  let max = 10000;
  logData();

  while (state !== "ACCEPT") {
    steps++;

    check();
    logData();
    max--;
    if (max === 0) {
      throw new Error("Maximum parse length exceeded.");
    }
  }

 tree = appStack.all()[0].value;
}

function check() {
  let nextToken = null;
  let fromStack = false;
  if (stackPointer !== appStack.length()) {
    nextToken = appStack.all()[stackPointer];
    stackPointer++;
    fromStack = true;
  } else {
    nextToken = input.peek();
  }

  const entry = parseTable[state];
  const nextTokenSymbol = nextToken.type;
  if (!entry[nextTokenSymbol] && !entry.reduce) {
    throw new Error("Unexpected token '" + nextToken + "'");
  }

  const nextStep = entry[nextTokenSymbol] || entry.reduce;
  const actionType = nextStep[0];
  const actionNumber = nextStep[1];

  if (actionType === "S" || nextStep === "ACCEPT") {
    if (!fromStack) {
      appStack.push(input.pop());
      stackPointer++;
    }

    if (nextStep === "ACCEPT") {
      state = "ACCEPT";
      return;
    }

    state = parseInt(nextStep[1], 10);
  } else if (actionType === "R") {

    const production = productions[actionNumber];
    const poppedItems = [];
    for (let i = 0; i < production.right.length; i++) {
      poppedItems.push(appStack.pop());
    }

    const poppedValues = poppedItems.map(p => p.value || p.type);

    appStack.push({
      type: production.left,
      value: new Tree(production.left, reverse(poppedValues)),
    });

    state = 1;
    stackPointer = 0;
  } else {
    throw new Error("Unrecognized action " + nextStep);
  }

  lastAction = nextStep;
}

function logData() {
  return;

  console.log("appStack\t\tinput\t\tstate\t\taction" );
  console.log(appStack.all().map(i => i.type).join("") + "\t\t" + reverse(input.all()).map(i => i.value || i.type).join("") + "\t\t" + state + "\t\t" + lastAction);
  console.log("");
}

function main(arr) {
  init(reverse(arr));
  parse();
  console.log(arr.map(p => p.value || p.type).join(" ") + " = " + calc(tree))
}

function calc(tree) {
  if (typeof tree === "string") {
    return parseInt(tree, 10);
  }

  if (tree.childrens.length === 3) {
    if (tree.childrens[1] === "*") {
      return calc(tree.childrens[0]) * calc(tree.childrens[2]);
    } else if (tree.childrens[1] === "/") {
      return calc(tree.childrens[0]) / calc(tree.childrens[2]);
    } else if (tree.childrens[1] === "+") {
      return calc(tree.childrens[0]) + calc(tree.childrens[2]);
    } else {
      return calc(tree.childrens[0]) - calc(tree.childrens[2]);
    }
  } else if (tree.childrens.length === 1) {
    return calc(tree.childrens[0]);
  }
}

main([
  { type: "id", value: "30" },
  { type: "+", value: null },
  { type: "id", value: "10" },
  { type: "*", value: null },
  { type: "id", value: "70" },
  { type: "-", value: null, },
  { type: "id", value: "10" },
]);
