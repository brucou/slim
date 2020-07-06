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

false;

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var cs = "nok";
  var es = initialExtendedState;

  var eventHandlers = {
    nok: {
      init: function (s, ed, stg) {
        let computed = null;
        if (guards["isNumber"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n0ღNumber";
        } else if (guards["not(isNumber)"](s, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2ღOther";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    n0ღNumber: {
      continue: function (s, ed, stg) {
        let computed = actions["logNumber"](s, ed, stg);
        cs = "n3ღDone";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    n2ღOther: {
      continue: function (s, ed, stg) {
        let computed = actions["logOther"](s, ed, stg);
        cs = "n3ღDone";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
  };
  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;

    if (controlStateHandlingEvent) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      // If transition, but no guards fulfilled => null, else => computed outputs
      return computed === null ? [null] : computed.outputs;
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
