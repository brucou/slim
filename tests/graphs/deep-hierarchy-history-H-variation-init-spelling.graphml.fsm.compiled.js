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
//   "logGroup1toH": function (extendedState, eventData, settings){},
//   "logBtoC": function (extendedState, eventData, settings){},
//   "logBtoD": function (extendedState, eventData, settings){},
//   "logCtoD": function (extendedState, eventData, settings){},
//   "logGroup1toD": function (extendedState, eventData, settings){},
//   "logGroup1toC": function (extendedState, eventData, settings){},
//   "logDtoD": function (extendedState, eventData, settings){},
// };
// -------Control states---------
/*
      {"0":"nok","1":"INitღn0","2":"Eღn1","3":"Group 1ღn2","4":"Bღn2::n0","5":"Cღn2::n1","6":"Group 1ღn2::n2","7":"Dღn2::n2::n0","8":"Dღn2::n2::n2","9":"Initღn2::n3"}
      */
// ------------------------------
var nextEventMap = [-1, -1, "", "init", -1, "", "init", -1, -1, -1];

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
  var parentMap = [null, null, null, null, 3, 3, 3, 6, 6, 3];
  // Start with pre-initial state "nok"
  var cs = 0;
  var es = initialExtendedState;
  var hs = { deep: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], shallow: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1] };

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = [
    {
      init: function (s, ed, stg) {
        // Transition to Bღn2::n0;
        cs = 4; // No action, only cs changes!
        hs = updateHistoryState(hs, getAncestors, cs);

        return { outputs: [], updates: [] };
      },
    },
    ,
    {
      "": function (s, ed, stg) {
        // Transition to [object Object];
        cs = hs["shallow"][3]; // No action, only cs changes!
        hs = updateHistoryState(hs, getAncestors, cs);

        return { outputs: [], updates: [] };
      },
    },
    {
      event3: function (s, ed, stg) {
        let computed = actions["logGroup1toH"](s, ed, stg);
        // Transition to Eღn1;
        cs = 2;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },

      init: function (s, ed, stg) {
        let computed = actions["logGroup1toC"](s, ed, stg);
        // Transition to Cღn2::n1;
        cs = 5;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    {
      event2: function (s, ed, stg) {
        let computed = actions["logBtoC"](s, ed, stg);
        // Transition to Cღn2::n1;
        cs = 5;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },

      event1: function (s, ed, stg) {
        let computed = actions["logBtoD"](s, ed, stg);
        // Transition to Dღn2::n2::n2;
        cs = 8;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    {
      "": function (s, ed, stg) {
        let computed = actions["logCtoD"](s, ed, stg);
        // Transition to Dღn2::n2::n0;
        cs = 7;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    {
      init: function (s, ed, stg) {
        let computed = actions["logGroup1toD"](s, ed, stg);
        // Transition to Dღn2::n2::n0;
        cs = 7;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

        return computed;
      },
    },
    ,
    {
      event1: function (s, ed, stg) {
        let computed = actions["logDtoD"](s, ed, stg);
        // Transition to Dღn2::n2::n0;
        cs = 7;
        es = updateState(s, computed.updates);
        hs = updateHistoryState(hs, getAncestors, cs);

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

export { createStateMachine };
