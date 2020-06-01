// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
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
var nextEventMap = { "n1ღGroup 1": "init" };

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = { "n1::n0ღNumber": "n1ღGroup 1", "n1::n2ღOther": "n1ღGroup 1", "n1::n3ღDone": "n1ღGroup 1" };
  var cs = "nok";
  var es = initialExtendedState;

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        cs = "n1ღGroup 1"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    "n1::n0ღNumber": {
      continue: function (es, ed, stg) {
        let computed = actions["logNumber"](es, ed, stg);
        cs = "n1::n3ღDone";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    "n1ღGroup 1": {
      init: function (es, ed, stg) {
        let computed = null;
        if (guards["isNumber"](es, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n1::n0ღNumber";
        } else if (guards["not(isNumber)"](es, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n1::n2ღOther";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
    },
    "n1::n2ღOther": {
      continue: function (es, ed, stg) {
        let computed = actions["logOther"](es, ed, stg);
        cs = "n1::n3ღDone";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
  };
  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = [cs].concat(getAncestors(cs) || []).find(function (controlState) {
      return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
    });

    if (controlStateHandlingEvent) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      return computed === null
        ? // If transition, but no guards fulfilled => null, else
          null
        : nextEventMap[cs] == null
        ? computed.outputs
        : // Run automatic transition if any
          computed.outputs.concat(process({ [nextEventMap[cs]]: eventData }));
    }
    // Event is not accepted by the machine
    else return null;
  }

  // Start the machine
  process({ ["init"]: initialExtendedState });

  return process;
}

export { createStateMachine };
