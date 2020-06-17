// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
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
//   "logAtoB": function (){},
//   "logAtoC": function (){},
// };
// ----------------
var nextEventMap = { "n2ღGroup 1": "init" };

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = { "n2::n0ღB": "n2ღGroup 1", "n2::n2ღC": "n2ღGroup 1" };
  var cs = "nok";
  var es = initialExtendedState;

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = {
    nok: {
      init: function (s, ed, stg) {
        cs = "n1ღA"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    "n2ღGroup 1": {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["isNumber"](s, ed, stg)) {
          computed = actions["logAtoB"](s, ed, stg);
          cs = "n2::n0ღB";
        } else if (guards["not(isNumber)"](s, ed, stg)) {
          computed = actions["logAtoC"](s, ed, stg);
          cs = "n2::n2ღC";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    n1ღA: {
      event1: function (s, ed, stg) {
        cs = "n2ღGroup 1"; // No action, only cs changes!

        return { outputs: [], updates: [] };
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

module.exports = {
  createStateMachine,
};
