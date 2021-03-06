// Copy-paste help
// For debugging purposes, functions should all have a name
// Using natural language sentences in the graph is valid
// However, you will have to find a valid JavaScript name for the matching function
// -----Guards------
// const guards = {
//   "isNumber": function (){},
//   "not(isNumber)": function (){},
// };
// -----Actions------
// const actions = {
//   "logNumber": function (){},
//   "logOther": function (){},
// };
// ----------------
function contains(as, bs) {
  return as.every(function (a) {
    return bs.indexOf(a) > -1;
  });
}
var NO_OUTPUT = null;
var NO_STATE_UPDATE = [];
var events = ["continue"];
var states = { "n1ღGroup 1": { "n1::n0ღNumber": "", "n1::n2ღOther": "", "n1::n3ღDone": "" } };
function getKinglyTransitions(record) {
  var aF = record.actionFactories;
  var guards = record.guards;
  var actionList = ["ACTION_IDENTITY", "logNumber", "logOther"];
  var predicateList = ["isNumber", "not(isNumber)"];
  aF["ACTION_IDENTITY"] = function ACTION_IDENTITY() {
    return {
      outputs: NO_OUTPUT,
      updates: NO_STATE_UPDATE,
    };
  };
  if (!contains(actionList, Object.keys(aF))) {
    console.error({ actionFactories: Object.keys(aF), actionList });
    throw new Error("Some action are missing either in the graph, or in the action implementation object!");
  }
  if (!contains(predicateList, Object.keys(guards))) {
    console.error({ guards: Object.keys(guards), predicateList });
    throw new Error("Some guards are missing either in the graph, or in the guard implementation object!");
  }
  const transitions = [
    { from: "nok", event: "init", to: "n1ღGroup 1", action: aF["ACTION_IDENTITY"] },
    { from: "n1::n0ღNumber", event: "continue", to: "n1::n3ღDone", action: aF["logNumber"] },
    {
      from: "n1ღGroup 1",
      event: "init",
      guards: [
        { predicate: guards["isNumber"], to: "n1::n0ღNumber", action: aF["ACTION_IDENTITY"] },
        { predicate: guards["not(isNumber)"], to: "n1::n2ღOther", action: aF["ACTION_IDENTITY"] },
      ],
    },
    { from: "n1::n2ღOther", event: "continue", to: "n1::n3ღDone", action: aF["logOther"] },
  ];

  return transitions;
}

export { events, states, getKinglyTransitions };
