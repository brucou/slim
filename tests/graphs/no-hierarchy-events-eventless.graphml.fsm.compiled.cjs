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
//   "logAtoB": function (extendedState, eventData, settings){},
//   "logAtoC": function (extendedState, eventData, settings){},
//   "logBtoD": function (extendedState, eventData, settings){},
//   "logCtoD": function (extendedState, eventData, settings){},
//   "logDtoA": function (extendedState, eventData, settings){},
// };
// -------Control states---------
/*
      {"0":"nok","1":"Aღn1","2":"Bღn2","3":"Cღn3","4":"Dღn4"}
      */
// ------------------------------
var nextEventMap = [-1, -1, -1, -1, ""];

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  // Start with pre-initial state "nok"
  var cs = 0;
  var es = initialExtendedState;

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
        let computed = actions["logAtoB"](s, ed, stg);
        // Transition to Bღn2;
        cs = 2;
        es = updateState(s, computed.updates);

        return computed;
      },

      event2: function (s, ed, stg) {
        let computed = actions["logAtoC"](s, ed, stg);
        // Transition to Cღn3;
        cs = 3;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      event2: function (s, ed, stg) {
        let computed = actions["logBtoD"](s, ed, stg);
        // Transition to Dღn4;
        cs = 4;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      event1: function (s, ed, stg) {
        let computed = actions["logCtoD"](s, ed, stg);
        // Transition to Dღn4;
        cs = 4;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](s, ed, stg)) {
          computed = actions["logDtoA"](s, ed, stg);
          // Transition to "Aღn1";
          cs = 1;
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
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;

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
