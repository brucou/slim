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
// -------Control states---------
/*
      {"0":"nok","1":"Group 1ღn1","2":"Numberღn1::n0","3":"Otherღn1::n2","4":"Doneღn1::n3"}
      */
// ------------------------------
var nextEventMap = [-1, "init", -1, -1, -1];

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = [null, null, 1, 1, 1];
  // Start with pre-initial state "nok"
  var cs = 0;
  var es = initialExtendedState;

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = [
    {
      init: function (s, ed, stg) {
        // Transition to Group 1ღn1;
        cs = 1; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["isNumber"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          // Transition to "Numberღn1::n0";
          cs = 2;
        } else if (guards["not(isNumber)"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          // Transition to "Otherღn1::n2";
          cs = 3;
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    {
      continue: function (s, ed, stg) {
        let computed = actions["logNumber"](s, ed, stg);
        // Transition to Doneღn1::n3;
        cs = 4;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      continue: function (s, ed, stg) {
        let computed = actions["logOther"](s, ed, stg);
        // Transition to Doneღn1::n3;
        cs = 4;
        es = updateState(s, computed.updates);

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
