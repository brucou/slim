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
// -------Control states---------
/*
      {"0":"nok","1":"Aღn1","2":"Group 1ღn2","3":"Bღn2::n0","4":"Group 2ღn2::n2","5":"Group 3ღn2::n2::n1","6":"Bღn2::n2::n1::n0","7":"Cღn2::n2::n1::n2","8":"Group 4ღn2::n2::n1::n3","9":"Aღn2::n2::n1::n3::n0","10":"Bღn2::n2::n1::n3::n1","11":"Cღn2::n2::n1::n3::n2","12":"Dღn2::n2::n1::n3::n3"}
      */
// ------------------------------
var nextEventMap = [-1, -1, "init", "", "init", "init", -1, -1, "init", -1, -1, -1, ""];

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = [null, null, null, 2, 2, 4, 5, 5, 5, 8, 8, 8, 8];
  // Start with pre-initial state "nok"
  var cs = 0;
  var es = initialExtendedState;

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = [
    {
      init: function (s, ed, stg) {
        // Transition to Aღn1;
        cs = 1; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    {
      event1: function (s, ed, stg) {
        var computed = actions["logAtoGroup1"](s, ed, stg);
        // Transition to Group 1ღn2;
        cs = 2;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      init: function (s, ed, stg) {
        var computed = actions["logGroup1toGroup2"](s, ed, stg);
        // Transition to Bღn2::n0;
        cs = 3;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        // Transition to Group 2ღn2::n2;
        cs = 4; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    {
      init: function (s, ed, stg) {
        var computed = actions["logGroup2toGroup3"](s, ed, stg);
        // Transition to Group 3ღn2::n2::n1;
        cs = 5;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["isNumber"](s, ed, stg)) {
          computed = actions["logGroup3toB"](s, ed, stg);
          // Transition to "Bღn2::n2::n1::n0";
          cs = 6;
        } else if (guards["not(isNumber)"](s, ed, stg)) {
          computed = actions["logGroup3toC"](s, ed, stg);
          // Transition to "Cღn2::n2::n1::n2";
          cs = 7;
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    {
      event1: function (s, ed, stg) {
        var computed = actions["logGroup3BtoGroup4"](s, ed, stg);
        // Transition to Group 4ღn2::n2::n1::n3;
        cs = 8;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    ,
    {
      init: function (s, ed, stg) {
        // Transition to Aღn2::n2::n1::n3::n0;
        cs = 9; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    {
      event1: function (s, ed, stg) {
        var computed = actions["logAtoB"](s, ed, stg);
        // Transition to Bღn2::n2::n1::n3::n1;
        cs = 10;
        es = updateState(s, computed.updates);

        return computed;
      },

      event2: function (s, ed, stg) {
        var computed = actions["logAtoC"](s, ed, stg);
        // Transition to Cღn2::n2::n1::n3::n2;
        cs = 11;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      event2: function (s, ed, stg) {
        var computed = actions["logBtoD"](s, ed, stg);
        // Transition to Dღn2::n2::n1::n3::n3;
        cs = 12;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      event1: function (s, ed, stg) {
        var computed = actions["logCtoD"](s, ed, stg);
        // Transition to Dღn2::n2::n1::n3::n3;
        cs = 12;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](s, ed, stg)) {
          computed = actions["logDtoA"](s, ed, stg);
          // Transition to "Aღn2::n2::n1::n3::n0";
          cs = 9;
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
  ];

  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = [cs].concat(getAncestors(cs) || []).find(function (controlState) {
      return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
    });
    // console.warn('controlStateHandlingEvent', controlStateHandlingEvent);

    if (controlStateHandlingEvent != null) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      return computed === null
        ? // If transition, but no guards fulfilled => null, else
          [null]
        : nextEventMap[cs] === -1
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
