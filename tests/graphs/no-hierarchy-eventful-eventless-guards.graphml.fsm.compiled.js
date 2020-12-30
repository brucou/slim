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
//   "condition1": function (extendedState, eventData, settings){},
//   "condition2": function (extendedState, eventData, settings){},
//   "condition3": function (extendedState, eventData, settings){},
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
//   "logAtoTemp1": function (extendedState, eventData, settings){},
//   "logAtoTemp2": function (extendedState, eventData, settings){},
//   "logAtoDone": function (extendedState, eventData, settings){},
//   "logTemp1toA": function (extendedState, eventData, settings){},
//   "logTemp2toA": function (extendedState, eventData, settings){},
// };
// -------Control states---------
/*
      {"0":"nok","1":"Aღn1","2":"Temp1ღn2","3":"Temp2ღn3","4":"Doneღn4"}
      */
// ------------------------------
var nextEventMap = [-1, -1, "", "", ""];

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
      event: function (s, ed, stg) {
        let computed = null;
        if (guards["condition1"](s, ed, stg)) {
          computed = actions["logAtoTemp1"](s, ed, stg);
          // Transition to "Temp1ღn2";
          cs = 2;
        } else if (guards["condition2"](s, ed, stg)) {
          computed = actions["logAtoTemp2"](s, ed, stg);
          // Transition to "Temp2ღn3";
          cs = 3;
        } else if (guards["condition3"](s, ed, stg)) {
          computed = actions["logAtoDone"](s, ed, stg);
          // Transition to "Doneღn4";
          cs = 4;
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        var computed = actions["logTemp1toA"](s, ed, stg);
        // Transition to Aღn1;
        cs = 1;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        var computed = actions["logTemp2toA"](s, ed, stg);
        // Transition to Aღn1;
        cs = 1;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
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

export { createStateMachine };
