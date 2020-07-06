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
//   "logDtoGroup1H": function (extendedState, eventData, settings){},
//   "logBtoD": function (extendedState, eventData, settings){},
//   "logBtoC": function (extendedState, eventData, settings){},
//   "logCtoD": function (extendedState, eventData, settings){},
//   "logGroup1toC": function (extendedState, eventData, settings){},
// };
// ----------------
var nextEventMap = { n1ღD: "", "n2ღGroup 1": "init" };

false;
function updateHistoryState(history, getAncestors, state_from_name) {
  if (state_from_name === "nok") {
    return history;
  } else {
    var ancestors = getAncestors(state_from_name) || [];
    ancestors.reduce((oldAncestor, newAncestor) => {
      // set the exited state in the history of all ancestors
      history["deep"][newAncestor] = state_from_name;
      history["shallow"][newAncestor] = oldAncestor;

      return newAncestor;
    }, state_from_name);

    return history;
  }
}

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = { "n2::n0ღB": "n2ღGroup 1", "n2::n1ღC": "n2ღGroup 1", "n2::n2ღD": "n2ღGroup 1" };
  var cs = "nok";
  var es = initialExtendedState;
  var hs = {
    deep: { n1ღD: "", "n2ღGroup 1": "", "n2::n0ღB": "", "n2::n1ღC": "", "n2::n2ღD": "" },
    shallow: { n1ღD: "", "n2ღGroup 1": "", "n2::n0ღB": "", "n2::n1ღC": "", "n2::n2ღD": "" },
  };

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = {
    "n2ღGroup 1": {
      event3: function (s, ed, stg) {
        cs = "n1ღD"; // No action, only cs changes!
        hs = updateHistoryState(hs, getAncestors, cs);

        return { outputs: [], updates: [] };
      },

      init: function (s, ed, stg) {
        let computed = actions["logGroup1toC"](s, ed, stg);
        cs = "n2::n1ღC";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    n1ღD: {
      "": function (s, ed, stg) {
        let computed = actions["logDtoGroup1H"](s, ed, stg);
        cs = hs["shallow"]["n2ღGroup 1"];
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    nok: {
      init: function (s, ed, stg) {
        cs = "n2::n0ღB"; // No action, only cs changes!
        hs = updateHistoryState(hs, getAncestors, cs);

        return { outputs: [], updates: [] };
      },
    },
    "n2::n0ღB": {
      event1: function (s, ed, stg) {
        let computed = actions["logBtoD"](s, ed, stg);
        cs = "n2::n2ღD";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },

      event2: function (s, ed, stg) {
        let computed = actions["logBtoC"](s, ed, stg);
        cs = "n2::n1ღC";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    "n2::n1ღC": {
      event1: function (s, ed, stg) {
        let computed = actions["logCtoD"](s, ed, stg);
        cs = "n2::n2ღD";
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

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
