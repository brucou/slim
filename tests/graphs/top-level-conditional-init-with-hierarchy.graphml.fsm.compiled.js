// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
/**
 * @param {E} extendedState
 * @param {D} eventData
 * @param {X} settings
 * @returns Boolean
 */
// const guards = {
//   "isNumber": function (extendedState, eventData, settings){},
//   "not(isNumber)": function (extendedState, eventData, settings){},
// };
// -----Actions------
/**
 * @param {E} extendedState
 * @param {D} eventData
 * @param {X} settings
 * @returns {{updates: U[], outputs: O[]}}
 * (such that updateState:: E -> U[] -> E)
 */
// const actions = {
//   "logNumber": function (extendedState, eventData, settings){},
//   "logOther": function (extendedState, eventData, settings){},
// };
// ----------------
var nextEventMap = { "n1ღGroup 1": "init" };

false;

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
      init: function (s, ed, stg) {
        cs = "n1ღGroup 1"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    "n1::n0ღNumber": {
      continue: function (s, ed, stg) {
        let computed = actions["logNumber"](s, ed, stg);
        cs = "n1::n3ღDone";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n1ღGroup 1": {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["isNumber"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n1::n0ღNumber";
        } else if (guards["not(isNumber)"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n1::n2ღOther";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    "n1::n2ღOther": {
      continue: function (s, ed, stg) {
        let computed = actions["logOther"](s, ed, stg);
        cs = "n1::n3ღDone";
        es = updateState(s, computed.updates);

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
          [null]
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
