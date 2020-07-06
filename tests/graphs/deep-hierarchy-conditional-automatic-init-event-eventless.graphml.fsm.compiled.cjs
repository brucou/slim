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
//   "shouldReturnToA": function (extendedState, eventData, settings){},
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
//   "logAtoGroup1": function (extendedState, eventData, settings){},
//   "logGroup1toGroup2": function (extendedState, eventData, settings){},
//   "logGroup2toGroup3": function (extendedState, eventData, settings){},
//   "logGroup3BtoGroup4": function (extendedState, eventData, settings){},
//   "logGroup3toB": function (extendedState, eventData, settings){},
//   "logGroup3toC": function (extendedState, eventData, settings){},
//   "logAtoB": function (extendedState, eventData, settings){},
//   "logAtoC": function (extendedState, eventData, settings){},
//   "logBtoD": function (extendedState, eventData, settings){},
//   "logCtoD": function (extendedState, eventData, settings){},
//   "logDtoA": function (extendedState, eventData, settings){},
// };
// ----------------
var nextEventMap = {
  "n2ღGroup 1": "init",
  "n2::n0ღB": "",
  "n2::n2ღGroup 2": "init",
  "n2::n2::n1ღGroup 3": "init",
  "n2::n2::n1::n3ღGroup 4": "init",
  "n2::n2::n1::n3::n3ღD": "",
};

false;

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = {
    "n2::n0ღB": "n2ღGroup 1",
    "n2::n2ღGroup 2": "n2ღGroup 1",
    "n2::n2::n1ღGroup 3": "n2::n2ღGroup 2",
    "n2::n2::n1::n0ღB": "n2::n2::n1ღGroup 3",
    "n2::n2::n1::n2ღC": "n2::n2::n1ღGroup 3",
    "n2::n2::n1::n3ღGroup 4": "n2::n2::n1ღGroup 3",
    "n2::n2::n1::n3::n0ღA": "n2::n2::n1::n3ღGroup 4",
    "n2::n2::n1::n3::n1ღB": "n2::n2::n1::n3ღGroup 4",
    "n2::n2::n1::n3::n2ღC": "n2::n2::n1::n3ღGroup 4",
    "n2::n2::n1::n3::n3ღD": "n2::n2::n1::n3ღGroup 4",
  };
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
    n1ღA: {
      event1: function (s, ed, stg) {
        let computed = actions["logAtoGroup1"](s, ed, stg);
        cs = "n2ღGroup 1";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n0ღB": {
      "": function (s, ed, stg) {
        cs = "n2::n2ღGroup 2"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    "n2ღGroup 1": {
      init: function (s, ed, stg) {
        let computed = actions["logGroup1toGroup2"](s, ed, stg);
        cs = "n2::n0ღB";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n2ღGroup 2": {
      init: function (s, ed, stg) {
        let computed = actions["logGroup2toGroup3"](s, ed, stg);
        cs = "n2::n2::n1ღGroup 3";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n0ღB": {
      event1: function (s, ed, stg) {
        let computed = actions["logGroup3BtoGroup4"](s, ed, stg);
        cs = "n2::n2::n1::n3ღGroup 4";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1ღGroup 3": {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["isNumber"](s, ed, stg)) {
          computed = actions["logGroup3toB"](s, ed, stg);
          cs = "n2::n2::n1::n0ღB";
        } else if (guards["not(isNumber)"](s, ed, stg)) {
          computed = actions["logGroup3toC"](s, ed, stg);
          cs = "n2::n2::n1::n2ღC";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    "n2::n2::n1::n3::n0ღA": {
      event1: function (s, ed, stg) {
        let computed = actions["logAtoB"](s, ed, stg);
        cs = "n2::n2::n1::n3::n1ღB";
        es = updateState(s, computed.updates);

        return computed;
      },

      event2: function (s, ed, stg) {
        let computed = actions["logAtoC"](s, ed, stg);
        cs = "n2::n2::n1::n3::n2ღC";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n3::n1ღB": {
      event2: function (s, ed, stg) {
        let computed = actions["logBtoD"](s, ed, stg);
        cs = "n2::n2::n1::n3::n3ღD";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n3::n2ღC": {
      event1: function (s, ed, stg) {
        let computed = actions["logCtoD"](s, ed, stg);
        cs = "n2::n2::n1::n3::n3ღD";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n3::n3ღD": {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](s, ed, stg)) {
          computed = actions["logDtoA"](s, ed, stg);
          cs = "n2::n2::n1::n3::n0ღA";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    "n2::n2::n1::n3ღGroup 4": {
      init: function (s, ed, stg) {
        cs = "n2::n2::n1::n3::n0ღA"; // No action, only cs changes!

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

module.exports = {
  createStateMachine,
};
